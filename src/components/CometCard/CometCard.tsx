import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../store'
import { addCometToRequest, getCartInfo } from '../../store/slices/requestSlice'
import { Comet } from '../../types'
import { getDefaultImagePath } from '../../config/target_config'
import './CometCard.css'

const defaultImage = getDefaultImagePath()

interface CometCardProps {
    comet: Comet
}

export const CometCard: FC<CometCardProps> = ({ comet }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)

    const handleCardClick = () => {
        navigate(`/comets/${comet.id}`)
    }

    const handleAddToRequest = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (comet.id) {
            try {
                await dispatch(addCometToRequest(comet.id)).unwrap()
                dispatch(getCartInfo())
            } catch (error) {
                console.error('Ошибка при добавлении услуги в заявку:', error)
            }
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
                {isAuthenticated && (
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAddToRequest}
                        style={{ marginTop: '10px', width: '100%' }}
                    >
                        Добавить
                    </Button>
                )}
            </div>
        </div>
    )
}

