// InfoBar.jsx
interface AppInfoBarProps {
    bcvInfo: string;
    binanceInfo: string;
    colorPrimario: string;
}

function AppInfoBar({ bcvInfo, binanceInfo, colorPrimario }: AppInfoBarProps) {
    return (
        <div className="w-full text-sm text-white py-1 text-center" style={{ backgroundColor: colorPrimario }}>
            <div className="whitespace-nowrap">
                {bcvInfo} - {binanceInfo}
            </div>
        </div>
    );
}

export default AppInfoBar;