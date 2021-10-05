import React, {Component, useEffect, useState} from "react";
import API, {graphqlOperation} from "@aws-amplify/api";
import * as subscriptions from "./graphql/subscriptions";
import * as mutations from "./graphql/mutations";

function Click(props)  {
    const [value, setValue] = useState("Hi")
    useEffect(() => {
        let subscription
        async function setupSubscription() {
            subscription = API.graphql({
                query: subscriptions.counterChange,
                variables: { name: props.name},
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
    }, [props.name])
    const sendUpdate = async (e) => {
        let newValue = value + "some text";
        await API.graphql(graphqlOperation(mutations.setCounter, { name: props.name, value: newValue}))
    }

    return (
        <div>
            <h1>{value}</h1>
            <button onClick={sendUpdate}>Click Me</button>
        </div>
    );
}
export default Click;
