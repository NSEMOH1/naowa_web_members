import naowaIcon from "../../assets/naowa.png";

interface LogoProps {
    className?: string;
    showText?: boolean;
    textClassName?: string;
}

export const Logo = ({
    className,
    showText = true,
    textClassName = "font-bold text-black"
}: LogoProps) => (
    <div className="flex items-center gap-4">
        <img className={className} src={naowaIcon} alt="logo" />
        {showText && (
            <p className={textClassName}>NAOWA</p>
        )}
    </div>
);