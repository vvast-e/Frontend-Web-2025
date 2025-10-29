import { FC } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../Routes'
import './Breadcrumbs.css'

interface ICrumb {
    label: string
    path?: string
}

interface BreadCrumbsProps {
    crumbs: ICrumb[]
}

export const Breadcrumbs: FC<BreadCrumbsProps> = ({ crumbs }) => {
    // Если нет крошек, не показываем breadcrumbs (мы на главной)
    if (!crumbs.length) {
        return null
    }

    return (
        <ul className="breadcrumbs">
            <li>
                <Link to={ROUTES.HOME}>Главная</Link>
            </li>
            {crumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                    <li className="slash">/</li>
                    <li>
                        {index === crumbs.length - 1 ? (
                            <span className="active">{crumb.label}</span>
                        ) : (
                            <Link to={crumb.path || ''}>{crumb.label}</Link>
                        )}
                    </li>
                </React.Fragment>
            ))}
        </ul>
    )
}

