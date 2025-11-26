import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addCometToRequest } from '../../store/slices/requestsSlice'
import { Comet } from '../../types'
import { getDefaultImagePath } from '../../config/target_config'
import './CometCard.css'

const defaultImage = getDefaultImagePath()

interface CometCardProps {
    comet: Comet
}

export const CometCard: FC<CometCardProps> = ({ comet }) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { isAuthenticated } = useAppSelector(state => state.auth)
    const { loading } = useAppSelector(state => state.requests)

    const handleCardClick = (e: React.MouseEvent) => {
        // Не переходим на страницу кометы если кликнули на кнопку
        if ((e.target as HTMLElement).closest('.add-to-request-btn')) {
            return
        }
        navigate(`/comets/${comet.id}`)
    }

    const handleAddToRequest = async (e: React.MouseEvent) => {
        e.stopPropagation()

        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        try {
            await dispatch(addCometToRequest({
                cometId: comet.id,
                quantity: 1,
                coords_x: 0,
                coords_y: 0,
                coords_z: 0
            })).unwrap()
        } catch (error) {
            console.error('Error adding comet to request:', error)
        }
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
                </div>
                <button
                    className="btn btn-red add-to-request-btn"
                    onClick={handleAddToRequest}
                    disabled={loading}
                >
                    Добавить
                </button>
            </div>
        </div>
    )
}

