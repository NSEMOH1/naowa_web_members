import { Avatar, Switch, Modal, Box, Text, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, FormControl, FormLabel, Input, Select, Textarea, HStack, PinInput, PinInputField, useToast } from "@chakra-ui/react"
import { PageHeader } from "../../components/pageHeader"
import { useAuth } from "../../hooks/useAuth"
import { CheckCircle, ChevronRight, Eye, File, Group, Key, Phone, RefreshCcw, Users2Icon, X } from "lucide-react"
import { useState } from "react"
import { Input as Password } from "antd"
import api from "../../api"
import { useMember } from "../../hooks/useMember"

const Items = [
    { id: 1, name: "Edit Profile", route: "", icon: Eye, type: "modal" },
    { id: 2, name: "Account Statement", route: "", icon: File, type: "modal" },
    { id: 3, name: "Update Your Next Of Kin", route: "", icon: Users2Icon, type: "modal" },
    { id: 5, name: "Request Refund", route: "", icon: RefreshCcw, type: "modal" },
    { id: 7, name: "Terminate Account", route: "", icon: X, type: "modal" },
    { id: 8, name: "Change Password", route: "", icon: Key, type: "modal" },
    { id: 9, name: "Contact Us", route: "", icon: Phone, type: "navigation" },
    { id: 10, name: "Change Transaction Pin", route: "", icon: Key, type: "modal" },
]

const Settings = () => {
    const { user } = useAuth()
    const { member } = useMember()
    const toast = useToast()
    const [hideBalance, setHideBalance] = useState(false)
    const [registerForAGM, setRegisterForAGM] = useState(false)
    const [activeModal, setActiveModal] = useState<string | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [newPassword, setNewPassword] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [isSubmitPassword, setIsSubmitPassword] = useState(false)
    const [pin, setPin] = useState<string>('');
    const [requestReason, setRequestReason] = useState('')
    const [requestAmount, setRequestAmount] = useState('')
    const [profileForm, setProfileForm] = useState({
        firstName: member?.first_name || '',
        lastName: member?.last_name || '',
        email: member?.email || '',
        phone: member?.phone,
        address: member?.address,
        bankName: member?.bank[0].name || '',
        accountNumber: member?.bank[0].account_number || ''
    });
    const [terminationReason, setTerminationReason] = useState('')
    const [terminationLoading, setTerminationLoading] = useState(false)

    const [nextOfKinForm, setNextOfKinForm] = useState({
        formerNextOfKin: '',
        newNextOfKin: '',
        reason: ''
    });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingNextOfKin, setIsUpdatingNextOfKin] = useState(false);

    const handleProfileUpdate = async () => {
        setIsUpdatingProfile(true);

        try {
            // Validate required fields
            if (!user?.id) {
                toast({
                    title: "Error",
                    description: "User ID is missing. Please log in again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            if (!profileForm.firstName || !profileForm.lastName || !profileForm.email) {
                toast({
                    title: "Validation Error",
                    description: "First name, last name, and email are required.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const updatePayload: Record<string, string> = {
                first_name: profileForm.firstName.trim(),
                last_name: profileForm.lastName.trim(),
                email: profileForm.email.trim(),
            };

            if (profileForm.phone?.trim()) {
                updatePayload.phone = profileForm.phone.trim();
            }

            if (profileForm.address?.trim()) {
                updatePayload.address = profileForm.address.trim();
            }

            console.log('Update payload:', updatePayload);

            const response = await api.put(`/api/member/${user.id}`, updatePayload);
            console.log('Update response:', response);

            toast({
                title: "Success",
                description: "Profile updated successfully. Bank information will be handled separately.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            onClose();

        } catch (error: any) {
            console.error('Profile update error:', error);

            let errorMessage = "Failed to update profile";

            if (error.response) {
                if (error.response.status === 400) {
                    errorMessage = error.response.data?.message || error.response.data?.error || "Invalid data provided";
                } else if (error.response.status === 401) {
                    errorMessage = "Unauthorized. Please log in again.";
                } else if (error.response.status === 404) {
                    errorMessage = "User not found";
                } else if (error.response.status >= 500) {
                    errorMessage = "Server error. Please try again later.";
                }
            } else if (error.request) {
                errorMessage = "Network error. Please check your connection.";
            } else {
                errorMessage = error.message || "An unexpected error occurred";
            }

            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleNextOfKinUpdate = async () => {
        setIsUpdatingNextOfKin(true);
        try {
            await api.put(`/api/member/${user?.id}`, {
                next_of_kin: {
                    name: nextOfKinForm.newNextOfKin
                }
            });

            toast({
                title: "Next of kin updated successfully",
                status: "success"
            });
            onClose();
        } catch (error) {
            console.error(error);
            toast({
                title: "Error updating next of kin",
                status: "error"
            });
        } finally {
            setIsUpdatingNextOfKin(false);
        }
    };


    const passwordPayload = {
        oldPassword,
        newPassword
    }

    const handleSwitchChange = (itemId: number, checked: boolean) => {
        if (itemId === 4) {
            setHideBalance(checked)
        } else if (itemId === 6) {
            setRegisterForAGM(checked)
        }
    }

    const getSwitchValue = (itemId: number) => {
        if (itemId === 4) return hideBalance
        if (itemId === 6) return registerForAGM
        return false
    }

    const handleItemClick = (item: any) => {
        if (item.type === "modal") {
            setActiveModal(item.name)
            onOpen()
        }
    }

    const handleChangePassword = async () => {
        setIsSubmitPassword(true)
        try {
            await api.post("/api/auth/change-password", passwordPayload)
            onClose()
            toast({ title: "Password Changed", status: "success" })
        } catch (err) {
            console.error(err)
            toast({ title: "Error Changing Password", status: "error" })
        } finally {
            setIsSubmitPassword(false)
        }
    }

    const handleChangePin = async () => {
        setIsSubmitPassword(true)
        try {
            await api.post("/api/member/change-pin", { pin: pin })
            onClose()
            toast({ title: "Transaction Pin Changed", status: "success" })
        } catch (err) {
            console.error(err)
            toast({ title: "Error Changing Pin", status: "error" })
        } finally {
            setIsSubmitPassword(false)
        }
    }

    const handleTerminationRequest = async () => {
        setTerminationLoading(true)
        try {
            await api.post("/api/termination", { reason: terminationReason })
            onClose()
            toast({ title: "Request Submitted", status: "success" })
        } catch (err) {
            console.error(err)
            toast({ title: "Error Submitting Request", status: "error" })
        } finally {
            setTerminationLoading(false)
        }
    }

    const requestPayload = {
        reason: requestReason,
        amount: requestAmount
    }
    const [isRequestLoading, setIsRequestLoading] = useState(false)

    const handleSubmitRequest = async () => {
        setIsRequestLoading(true)
        try {
            await api.post("/api/requests", requestPayload)
            onClose()
            toast({ title: "Request Submitted", status: "success" })
        } catch (err) {
            console.error(err)
            toast({ title: "Request Submission failed", status: "error" })
        } finally {
            setIsRequestLoading(false)
        }
    }

    const renderModalContent = () => {
        switch (activeModal) {
            case "Edit Profile":
                return (
                    <>
                        <ModalHeader>Edit Profile</ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-2 gap-4">
                                <FormControl isRequired isInvalid={!profileForm.firstName?.trim()}>
                                    <FormLabel>First Name</FormLabel>
                                    <Input
                                        type='text'
                                        value={profileForm.firstName || ''}
                                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                        placeholder="Enter first name"
                                    />
                                </FormControl>

                                <FormControl isRequired isInvalid={!profileForm.lastName?.trim()}>
                                    <FormLabel>Last Name</FormLabel>
                                    <Input
                                        type='text'
                                        value={profileForm.lastName || ''}
                                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                        placeholder="Enter last name"
                                    />
                                </FormControl>

                                <FormControl isRequired isInvalid={!profileForm.email?.trim()}>
                                    <FormLabel>Email address</FormLabel>
                                    <Input
                                        type='email'
                                        value={profileForm.email || ''}
                                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                        placeholder="Enter email address"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Phone number</FormLabel>
                                    <Input
                                        type='tel'
                                        value={profileForm.phone || ''}
                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                        placeholder="Enter phone number"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Bank Name</FormLabel>
                                    <Input
                                        type='text'
                                        value={profileForm.bankName || ''}
                                        onChange={(e) => setProfileForm({ ...profileForm, bankName: e.target.value })}
                                        placeholder="Enter bank name"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Account Number</FormLabel>
                                    <Input
                                        type='text'
                                        value={profileForm.accountNumber || ''}
                                        onChange={(e) => setProfileForm({ ...profileForm, accountNumber: e.target.value })}
                                        placeholder="Enter account number"
                                    />
                                </FormControl>
                            </div>

                            <FormControl mt={4}>
                                <FormLabel>Address</FormLabel>
                                <Input
                                    type='text'
                                    value={profileForm.address || ''}
                                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                    placeholder="Enter address"
                                />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button mr={3} variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="blue"
                                onClick={handleProfileUpdate}
                                isLoading={isUpdatingProfile}
                                loadingText="Updating..."
                                isDisabled={!profileForm.firstName?.trim() || !profileForm.lastName?.trim() || !profileForm.email?.trim()}
                            >
                                Save Changes
                            </Button>
                        </ModalFooter>
                    </>
                )
            case "Account Statement":
                return (
                    <>
                        <ModalHeader>Account Statement</ModalHeader>
                        <ModalBody>
                            <label htmlFor="">Statement To Print From</label>
                            <Select>
                                <option value='option1'>Loan</option>
                                <option value='option2'>Savings</option>
                            </Select>
                            <div className="flex gap-2 mt-5">
                                <FormControl>
                                    <FormLabel>Start Date</FormLabel>
                                    <Input type='date' />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>End Date</FormLabel>
                                    <Input type='date' />
                                </FormControl>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Submit
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </>
                )
            case "Update Your Next Of Kin":
                return (
                    <>
                        <ModalHeader>Update Next of Kin</ModalHeader>
                        <ModalBody>
                            <FormControl>
                                <FormLabel>Former Next Of Kin</FormLabel>
                                <Input
                                    type='text'
                                    value={nextOfKinForm.formerNextOfKin}
                                    isDisabled
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>New Next Of Kin</FormLabel>
                                <Input
                                    type='text'
                                    value={nextOfKinForm.newNextOfKin}
                                    onChange={(e) => setNextOfKinForm({ ...nextOfKinForm, newNextOfKin: e.target.value })}
                                />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Reason</FormLabel>
                                <Textarea
                                    value={nextOfKinForm.reason}
                                    onChange={(e) => setNextOfKinForm({ ...nextOfKinForm, reason: e.target.value })}
                                    size='lg'
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={handleNextOfKinUpdate}
                                isLoading={isUpdatingNextOfKin}
                                loadingText="Updating..."
                            >
                                Update
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </>
                )
            case "Request Refund":
                return (
                    <>
                        <ModalHeader>Request Refund</ModalHeader>
                        <ModalBody>
                            <FormControl>
                                <FormLabel>What are you requesting fund for</FormLabel>
                                <Textarea value={requestReason} onChange={(e) => setRequestReason(e.target.value)} size='lg' />
                            </FormControl>
                            <FormControl>
                                <FormLabel>How much refund are you requesting for</FormLabel>
                                <Textarea value={requestAmount} onChange={(e) => setRequestAmount(e.target.value)} size='lg' />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button isLoading={isRequestLoading} loadingText='Submitting Request' colorScheme="blue" mr={3} onClick={handleSubmitRequest}>
                                Submit
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </>
                )
            case "Terminate Account":
                return (
                    <>
                        <ModalHeader>Terminate Account</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to terminate your account? This action cannot be undone.</p>
                            <FormControl mt={4}>
                                <FormLabel>Reason</FormLabel>
                                <Textarea value={terminationReason} onChange={(e) => setTerminationReason(e.target.value)} size='lg' />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button isLoading={terminationLoading} loadingText='Submitting' colorScheme="red" mr={3} onClick={handleTerminationRequest}>
                                Terminate
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </>
                )
            case "Change Transaction Pin":
                return (
                    <>
                        <ModalHeader>Change Transaction Pin</ModalHeader>
                        <ModalBody>
                            <p className="text-center pb-6 font-bold text-lg">Enter Transaction Pin</p>
                            <HStack justifyContent='center'>
                                <PinInput
                                    otp
                                    size="lg"
                                    value={pin}
                                    onChange={(value) => setPin(value)}
                                    onComplete={(value) => setPin(value)}
                                >
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </HStack>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={handleChangePin}
                                isLoading={isSubmitPassword}
                                loadingText="Changing PIN..."
                            >
                                Continue
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </>

                )
            case "Change Password":
                return (
                    <>
                        <ModalHeader>Change Password</ModalHeader>
                        <ModalBody>
                            <Box>
                                <Text fontSize="md" color="gray.600" mb={4}>
                                    Enter your old password
                                </Text>
                                <Password.Password value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className='mb-5 h-10' placeholder="Enter old password" variant='filled' />
                                <Text fontSize="md" color="gray.600" mb={4}>
                                    Enter your new password
                                </Text>
                                <Password.Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className='mb-5 h-10' placeholder="Enter new password" variant='filled' />
                                <div className="text-xs gap-2 flex flex-col mb-4">
                                    <p className="flex gap-2 items-center font-thin"><CheckCircle size={18} />Minimum of eight (8) characters</p>
                                    <p className="flex gap-2 items-center font-thin"><CheckCircle size={18} />At least one (1) uppercase character</p>
                                    <p className="flex gap-2 items-center font-thin"><CheckCircle size={18} />Atleast one (1) symbol</p>
                                </div>
                                <Password.Password className='h-10' placeholder="Confirm new password" variant='filled' />
                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button isLoading={isSubmitPassword} colorScheme="red" mr={3} onClick={handleChangePassword}>
                                Confirm
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </>
                )

            default:
                return null
        }
    }

    return (
        <div>
            <PageHeader title="Settings" />
            <div>
                <div className="flex gap-2 items-center">
                    <Avatar size='lg' />
                    <div>
                        <p className="text-xl font-bold">{member?.first_name} {member?.last_name}</p>
                        <p className="text-gray-400">Service Number: {member?.service_number}</p>
                    </div>
                </div>
                <div className="mt-14 grid md:grid-cols-2 gap-4">
                    {Items.map((data) => (
                        <div
                            key={data.id}
                            className="flex justify-between gap-2 items-center bg-[#F8FCFF] px-4 py-4 rounded-lg cursor-pointer"
                            onClick={() => handleItemClick(data)}
                        >
                            <div className="flex gap-2 items-center">
                                <div className="bg-[#20A3DB] rounded-full p-2">
                                    <data.icon size={15} color="white" />
                                </div>
                                <p className="text-[#20A3DB] font-semibold">{data.name}</p>
                            </div>
                            {data.type === "switch" ? (
                                <Switch
                                    colorScheme="blue"
                                    size="md"
                                    isChecked={getSwitchValue(data.id)}
                                    onChange={(e) => handleSwitchChange(data.id, e.target.checked)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <ChevronRight color="#20A3DB" size={15} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    {renderModalContent()}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Settings