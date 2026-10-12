import {Card, Button, Modal} from "react-bootstrap"
import {useState} from "react"


function OrchidCard({orchid}){  //là nhận Props.

const [show, setShow] = useState(false);

return(


<Card>

<Card.Img 
    variant="top"
    src={orchid.image}
    style={{
        height: "300px",
        objectFit: "cover"
    }}
/>

<Card.Body>


<Card.Title>
{orchid.orchidName}
</Card.Title>


<Card.Text>
Category:
{orchid.category}
</Card.Text>


<Button
onClick={() => setShow(true)}
>
View Detail
</Button>


</Card.Body>

<Modal
    show={show}
    onHide={() => setShow(false)}
    centered
    size="sm"
>

<Modal.Header closeButton>

<Modal.Title>
{orchid.orchidName}
</Modal.Title>

</Modal.Header>


<Modal.Body>

<img
src={orchid.image}
alt={orchid.orchidName}
className="img-fluid"
/>


<p>
Category: {orchid.category}
</p>


<p>
Origin: {orchid.origin}
</p>


<p>
Color: {orchid.color}
</p>


<p>
Rating: {orchid.rating}
</p>


</Modal.Body>


<Modal.Footer>

<Button
variant="secondary"
onClick={() => setShow(false)}
>
Close
</Button>

</Modal.Footer>


</Modal>


</Card>

)

}


export default OrchidCard;