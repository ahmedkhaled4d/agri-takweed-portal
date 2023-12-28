import React from 'react'
import { Col, Row } from 'reactstrap'
import styles from './card.module.css'

export const Card = ({ cardTitle, cardSrc }) => {
  return (
    <Row>
      <Col md={6}>
        <p className={styles.cardTitle}>{cardTitle}</p>
        <a target="_blank" href={cardSrc} rel="noreferrer">
          <img src={cardSrc} alt={cardTitle} className={styles.cardImage} />
        </a>
      </Col>
    </Row>
  )
}
