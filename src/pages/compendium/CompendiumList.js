import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

export default function CompendiumList({ compendium }) {
  return (
    <ListGroup>
        {compendium?.map((item, idx) => (
            <ListGroupItem key={item.id} id={`item${idx}`}>{item.itemName}</ListGroupItem>
        ))}
    </ListGroup>
  )
}
