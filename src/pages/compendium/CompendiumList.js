import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

export default function CompendiumList({ compendium }) {
  return (
    <ListGroup>
        {compendium?.map((item) => (
            <ListGroupItem key={item.id}>{item.itemName}</ListGroupItem>
        ))}
    </ListGroup>
  )
}
