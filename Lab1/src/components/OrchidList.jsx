import {Container,Row,Col} from "react-bootstrap"

import {OrchidsData} from "../data/OrchidsData"

import OrchidCard from "./OrchidCard"



function OrchidList(){


return(

<Container>

<h2>
Orchid Collection
</h2>


<Row>


{
OrchidsData.map(
(orchid)=>(


<Col 
key={orchid.id}
>


<OrchidCard 
orchid={orchid}
/>


</Col>


)
)

}


</Row>


</Container>


)


}


export default OrchidList; 