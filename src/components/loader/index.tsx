import { Spinner } from "@chakra-ui/react"

export default function Loader() {
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="flex flex-col items-center">
				<Spinner color="#128DC1" size="xl" thickness='6px'  />
			</div>
		</div>
	);
}
