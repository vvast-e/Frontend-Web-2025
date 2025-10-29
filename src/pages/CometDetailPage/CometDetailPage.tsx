import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { ROUTES, ROUTE_LABELS } from '../../Routes'
import { Comet } from '../../types'
import { getCometById } from '../../modules/api'
import { Spinner } from 'react-bootstrap'
import './CometDetailPage.css'

const defaultImage = '/default-comet.png'

export const CometDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [comet, setComet] = useState<Comet | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) {
            navigate(ROUTES.COMETS)
            return
        }

        const loadComet = async () => {
            setLoading(true)
            try {
                const cometId = parseInt(id, 10)
                const data = await getCometById(cometId)
                setComet(data)
            } catch (error) {
                console.error('Error loading comet:', error)
                navigate(ROUTES.COMETS)
            } finally {
                setLoading(false)
            }
        }

        loadComet()
    }, [id, navigate])

    if (loading) {
        return (
            <div className="detail-loader">
                <Spinner animation="border" />
            </div>
        )
    }

    if (!comet) {
        return (
            <div className="detail-container">
                <p>Комета не найдена</p>
            </div>
        )
    }

    const imageUrl = comet.image_url || defaultImage

    return (
        <>
            <Breadcrumbs
                crumbs={[
                    { label: ROUTE_LABELS.COMETS, path: ROUTES.COMETS },
                    { label: comet.name },
                ]}
            />
            <article className="detail">
                <img
                    className="detail-image"
                    src={imageUrl}
                    alt={comet.name}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = defaultImage
                    }}
                />
                <div className="detail-body">
                    <h1>{comet.name}</h1>
                    <p className="desc">{comet.description}</p>

                    <div className="comet-coefficients">
                        <h3>Коэффициенты кометы:</h3>
                        <p>
                            <strong>k_x:</strong> {comet.k_x} а.е.
                        </p>
                        <p>
                            <strong>k_y:</strong> {comet.k_y} а.е.
                        </p>
                        <p>
                            <strong>k_z:</strong> {comet.k_z} а.е.
                        </p>
                    </div>
                </div>
            </article>
        </>
    )
}

