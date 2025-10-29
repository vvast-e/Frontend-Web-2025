import { FC, useState, useEffect } from 'react'
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs'
import { CometCard } from '../../components/CometCard/CometCard'
import { ROUTES, ROUTE_LABELS } from '../../Routes'
import { Comet } from '../../types'
import { getComets } from '../../modules/api'
import { Spinner } from 'react-bootstrap'
import './CometsPage.css'

export const CometsPage: FC = () => {
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [comets, setComets] = useState<Comet[]>([])

    useEffect(() => {
        loadComets()
    }, [])

    const loadComets = async () => {
        setLoading(true)
        try {
            const data = await getComets()
            setComets(data)
        } catch (error) {
            console.error('Error loading comets:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async () => {
        setLoading(true)
        try {
            const data = await getComets(searchValue)
            setComets(data)
        } catch (error) {
            console.error('Error searching comets:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Breadcrumbs crumbs={[{ label: ROUTE_LABELS.COMETS }]} />
            <div className="comets-container">
                <section className="toolbar">
                    <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                        <input
                            type="text"
                            placeholder="Поиск по наименованию кометы"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        <button type="submit" className="btn btn-red" disabled={loading}>
                            Найти
                        </button>
                    </form>
                    <div className="cart-stub" aria-label="cart">
                        <span className="cart-title">Корзина</span>
                        <span className="cart-sep">·</span>
                        <span className="cart-info">заявка # -1</span>
                        <span className="cart-sep">·</span>
                        <span className="cart-count">позиций 0</span>
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

