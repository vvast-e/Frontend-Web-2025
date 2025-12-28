import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { CometCard } from '../../components/CometCard/CometCard'
import { ROUTE_LABELS, ROUTES } from '../../Routes'
import { Comet } from '../../types'
import { getComets } from '../../modules/api'
import { Spinner } from 'react-bootstrap'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setTitle, resetFilters } from '../../store/slices/filtersSlice'
import { getCartInfo } from '../../store/slices/requestSlice'
import './CometsPage.css'

export const CometsPage: FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const title = useAppSelector((state) => state.filters.title)
    const app_id = useAppSelector((state) => state.request.app_id)
    const count = useAppSelector((state) => state.request.count)
    const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated)
    const [loading, setLoading] = useState(false)
    const [comets, setComets] = useState<Comet[]>([])

    useEffect(() => {
        loadComets()
        if (isAuthenticated) {
            dispatch(getCartInfo())
        }
    }, [isAuthenticated])

    const loadComets = async (searchTitle?: string) => {
        setLoading(true)
        try {
            const searchValue = searchTitle !== undefined ? searchTitle : title
            const data = await getComets(searchValue || undefined)
            setComets(data)
        } catch (error) {
            console.error('Error loading comets:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault()
        }
        await loadComets(title)
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setTitle(e.target.value))
    }

    const handleResetFilters = () => {
        dispatch(resetFilters())
        loadComets('')
    }

    return (
        <>
            <Breadcrumbs crumbs={[{ label: ROUTE_LABELS.COMETS }]} />
            <div className="comets-container">
                <section className="toolbar">
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Поиск по наименованию кометы"
                            value={title}
                            onChange={handleTitleChange}
                        />
                        <button type="submit" className="btn btn-red" disabled={loading}>
                            Найти
                        </button>
                        {title && (
                            <button 
                                type="button" 
                                className="btn btn-light" 
                                onClick={handleResetFilters}
                                disabled={loading}
                            >
                                Сбросить
                            </button>
                        )}
                    </form>
                    <div 
                        className={isAuthenticated && app_id ? "cart-card" : "cart-card inactive"}
                        aria-label="cart"
                        onClick={isAuthenticated && app_id ? () => navigate(`${ROUTES.REQUEST}/${app_id}`) : undefined}
                        style={isAuthenticated && app_id ? { cursor: 'pointer' } : {}}
                    >
                        <img src="/cart-icon.svg" alt="Корзина" className="cart-icon-img" />
                        {(!isAuthenticated || !app_id) ? null : (
                            count > 0 ? <span className="cart-badge">{count}</span> : null
                        )}
                    </div>
                </section>

                {loading && (
                    <div className="loadingBg">
                        <Spinner animation="border" />
                    </div>
                )}

                {!loading && comets.length === 0 && (
                    <p className="no-results">Кометы не найдены</p>
                )}

                {!loading && comets.length > 0 && (
                    <section className="grid">
                        {comets.map((comet) => (
                            <CometCard key={comet.id} comet={comet} />
                        ))}
                    </section>
                )}
            </div>
        </>
    )
}

