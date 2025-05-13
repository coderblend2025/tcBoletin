// InfoBar.jsx
interface AppInfoBarProps {
    bcvInfo: string;
    binanceInfo: string;
    colorPrimario: string;
}

function AppInfoBar({ bcvInfo, binanceInfo, colorPrimario }: AppInfoBarProps) {
    return (
        <div style={{ backgroundColor: '#03CF48' }} className="w-full text-sm text-white py-1 text-center">
            <div className="marquee-container">
                <div className="marquee">
                    {bcvInfo} - {binanceInfo}
                </div>
            </div>
        </div>
    );
}

export default AppInfoBar;
