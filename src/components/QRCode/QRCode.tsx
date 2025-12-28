import { FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './QRCode.css';

interface QRCodeProps {
    url: string;
    size?: number;
}

export const QRCode: FC<QRCodeProps> = ({ url, size = 200 }) => {
    return (
        <div className="qr-code-container">
            <div className="qr-code-wrapper">
                <QRCodeSVG
                    value={url}
                    size={size}
                    level="M"
                    includeMargin={true}
                />
            </div>
            <p className="qr-code-label">Отсканируйте для открытия на телефоне</p>
        </div>
    );
};

