import React, {Component, useEffect, useState} from "react";
import API, {graphqlOperation} from "@aws-amplify/api";
import * as subscriptions from "./graphql/subscriptions";
import * as mutations from "./graphql/mutations";

function Click(props)  {
    const [user, setUser] = useState("Hi")
    useEffect(() => {
        let subscription
        async function setupSubscription() {
            subscription = API.graphql({
                query: subscriptions.counterChange,
                variables: { page: props.page},
                authMode: 'API_KEY',
            }).subscribe({
                next: (data) => {
                    const counterChange = data.value.data.counterChange;
                    setValue(counterChange.value);
                }
            })
        }
        setupSubscription()
        return () => subscription.unsubscribe();
    }, [props.page])
    const sendUpdate = async (e) => {
        let newUser = user + "-timestamp";
        await API.graphql(graphqlOperation(mutations.setPageUser, { page: props.page, user: newUser}))
    }

    return (
        <div>
            <h1>{user}</h1>
            <button onClick={sendUpdate}>Click Me</button>
        </div>
    );
}
export default Click;
