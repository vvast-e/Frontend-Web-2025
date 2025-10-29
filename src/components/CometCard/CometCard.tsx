import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Comet } from '../../types'
import './CometCard.css'

const defaultImage = '/default-comet.png'

interface CometCardProps {
    comet: Comet
}

export const CometCard: FC<CometCardProps> = ({ comet }) => {
    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/comets/${comet.id}`)
    }

    const imageUrl = comet.image_url || defaultImage

    return (
        <div className="card" onClick={handleCardClick}>
            <img src={imageUrl} alt={comet.name} onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = defaultImage
            }} />
            <div className="card-body">
                <h3 className="card-title">{comet.name}</h3>
                <div className="card-meta">
                    <span className="price">{comet.price} ₽</span>
                    <button
                        className="btn btn-red add-btn"
                        onClick={(e) => {
                            e.stopPropagation()
                            // Заглушка: без реального запроса
                            console.debug('Добавить (stub): cometId=', comet.id)
                        }}
                    >
                        Добавить
                    </button>
                </div>
            </div>
        </div>
    )
}

