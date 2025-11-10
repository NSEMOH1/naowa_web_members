import React, { useState } from 'react';
import { Space } from 'antd';
import { Printer, Copy } from 'lucide-react';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import {
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Checkbox,
    Flex,
    Box,
    Select,
    HStack,
    Text,
    IconButton
} from '@chakra-ui/react';
import { MoveRight, MoveLeft } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { TableColumn } from '../../lib/types';
import { exportToExcel } from '../../lib/excelExport';

interface ColumnConfig {
    key: string;
    header: string;
    width: number;
    type: 'currency' | 'date' | 'number' | 'text';
}

interface DataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    rowKey: string;
    showExport?: boolean;
    showFilters?: boolean;
    pageSizeOptions?: number[];
    backgroundImage?: string;
    scrollX?: number;
    tableHeaderBg?: string
    tableHeaderColor?: string
}

const DataTable = <T extends object>({
    data,
    columns,
    rowKey,
    showExport = true,
    showFilters = true,
    pageSizeOptions = [10, 20, 50, 100],
    backgroundImage,
    tableHeaderBg,
    tableHeaderColor
}: DataTableProps<T>) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeOptions[0]);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    const currentData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / pageSize);

    const handleRowSelection = (id: React.Key) => {
        setSelectedRowKeys(prev =>
            prev.includes(id)
                ? prev.filter(key => key !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedRowKeys.length === currentData.length) {
            setSelectedRowKeys([]);
        } else {
            const currentIds = currentData.map(row => (row as any)[rowKey]);
            setSelectedRowKeys(currentIds);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const containerStyle: CSSProperties = {
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
    };

    const backgroundStyle: CSSProperties = backgroundImage ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        opacity: 0.4,
        pointerEvents: 'none',
    } : {};

    const handleExcelExport = () => {

        const exportColumns: ColumnConfig[] = columns.map(col => ({
            key: col.dataIndex as string,
            header: col.title as string,
            width: typeof col.width === 'number' ? Math.floor(col.width / 7) : 15,
            type: col.dataIndex?.toLowerCase().includes('amount') ? 'currency' :
                col.dataIndex?.toLowerCase().includes('date') ? 'date' :
                    typeof (data[0] as any)?.[col.dataIndex as string] === 'number' ? 'number' : 'text'
        }));

        exportToExcel({
            data: selectedRowKeys.length > 0
                ? data.filter(item => selectedRowKeys.includes((item as any)[rowKey]))
                : data,
            columns: exportColumns,
            filename: `export_${new Date().toISOString().split('T')[0]}.xlsx`,
            sheetName: 'Data Export'
        });
    };

    return (
        <Box className="rounded-lg" style={containerStyle}>
            {backgroundImage && <Box style={backgroundStyle} />}

            <Box position="relative" zIndex={1}>
                <Flex justifyContent="flex-end" mb={4}>
                    <Space>
                        {showExport && (
                            <Button size="sm" variant="outline" borderWidth="1px" borderColor="black" display="flex" gap={2} onClick={handleExcelExport}>
                                <DownloadOutlined /> Excel
                            </Button>
                        )}
                        {showFilters && (
                            <Button size="sm" variant="outline" borderWidth="1px" borderColor="black" display="flex" gap={2}>
                                <FilterOutlined /> Filters
                            </Button>
                        )}
                        <Button size="sm" variant="outline" borderWidth="1px" borderColor="black" display="flex" gap={2}>
                            <Printer /> Print
                        </Button>
                        <Button size="sm" variant="outline" borderWidth="1px" borderColor="black" display="flex" gap={2}>
                            <Copy /> Copy
                        </Button>
                    </Space>
                </Flex>

                <TableContainer maxHeight='100%' overflowX="auto" maxWidth="100%">
                    <Table variant="simple" size="md" className="bg-transparent">
                        <Thead bg={tableHeaderBg}>
                            <Tr>
                                <Th px={3} py={2} borderWidth="1px">
                                    <Checkbox
                                        isChecked={currentData.length > 0 && selectedRowKeys.length === currentData.length}
                                        onChange={handleSelectAll}
                                    />
                                </Th>
                                {columns.map((column, index) => (
                                    <Th
                                        key={index}
                                        px={3}
                                        py={2}
                                        borderWidth="1px"
                                        minWidth={column.width || 'auto'}
                                        color={tableHeaderColor}
                                    >
                                        {column.title}
                                    </Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {currentData.map((record: any) => (
                                <Tr key={record[rowKey]}>
                                    <Td px={3} py={2} borderWidth="1px">
                                        <Checkbox
                                            isChecked={selectedRowKeys.includes(record[rowKey])}
                                            onChange={() => handleRowSelection(record[rowKey])}
                                        />
                                    </Td>
                                    {columns.map((column, index) => (
                                        <Td
                                            key={index}
                                            px={3}
                                            py={2}
                                            borderWidth="1px"
                                        >
                                            {column.render
                                                ? column.render(column.dataIndex ? record[column.dataIndex] : undefined, record)
                                                : column.dataIndex ? record[column.dataIndex] : undefined}
                                        </Td>
                                    ))}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>

                <Flex justify="space-between" mt={4} align="center">
                    <Box>
                        <Text fontSize="sm">
                            Showing {startIndex + 1} to {endIndex} of {data.length} entries
                        </Text>
                    </Box>

                    <HStack spacing={2}>
                        <IconButton
                            aria-label="Previous page"
                            icon={<MoveLeft />}
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            isDisabled={currentPage === 1}
                        />

                        <Text fontSize="sm">
                            Page {currentPage} of {totalPages}
                        </Text>

                        <IconButton
                            aria-label="Next page"
                            icon={<MoveRight />}
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            isDisabled={currentPage === totalPages}
                        />

                        <Select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            size="sm"
                            width="80px"
                        >
                            {pageSizeOptions.map(size => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </Select>
                        <Text fontSize="sm">per page</Text>
                    </HStack>
                </Flex>
            </Box>
        </Box>
    );
};

export default DataTable;