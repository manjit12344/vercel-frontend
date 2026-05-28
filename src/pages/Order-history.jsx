import { useEffect } from "react";
import { useAddress } from "../store/my_api_handling";
import { useAuth } from "@clerk/clerk-react";
import OrderCard from "../components/orders card"  // orders,getOrder

export default function order() {
    const { getToken } = useAuth();
    const { orders, getOrder } = useAddress();
    useEffect(() => {
        async function see() {
            const token = await getToken();
            getOrder(token);
        }
        see()
    }, []);
    return (
        <div className="container mt-4">
            <div className="row">
                {orders.map((e) => (
                    <div className="col-md-6 col-lg-4" key={e.id}>
                        <OrderCard my_orders={e} />
                    </div>
                ))}
            </div>
        </div>


    )
}