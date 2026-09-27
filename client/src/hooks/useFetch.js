import { useEffect, useState } from "react";//to fetch & store data

export default function useFetch(url) {
// creating state
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
// useEffect must be called inside of Projects component
    useEffect(() => {

        async function getRepositories() {

            try {//attempt the request

                setIsLoading(true);

                const response = await fetch(url);

                if (!response.ok) {//create error message
                    throw new Error("Failed to retrieve data.");
                }

                const result = await response.json();

                setData(result);

            } catch (error) {//handle errors

                setError(error.message);

            } finally {//stop showing the loading indicator

                setIsLoading(false);

            }

        }

        getRepositories();

    }, [url]);//dependency array to prevent infinite loops

    return {
        data,
        isLoading,
        error
    };

}