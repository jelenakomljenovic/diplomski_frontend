import React, { useEffect, useState } from "react";
import { validateToken } from "../../api/token/token";
import { useNavigate } from "react-router-dom";
import { paths } from "../../constants/urlConstants";
import Loading from "../loading/Loading";

type ParseTokenProps = {
    token: string | null;
};

export default function ParseToken({ token }: ParseTokenProps) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1500));
        async function parseToken() {
            try {
                const tokenValidation = validateToken(token);
                await Promise.all([minLoadingTime, tokenValidation]);
                navigate(paths.VALIDATION + "?token=" + token);
            } catch (error: any) {
                if (error.response) {
                    if (error.response.status === 404) {
                        navigate(paths.FACULTIES);
                        await Promise.all([minLoadingTime])
                    } else if (error.response.status === 500) {
                        await Promise.all([minLoadingTime])
                        navigate(paths.LINK_EXPIRED + "?token=" + token);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        }
        parseToken();
    }, [token, navigate]);

    return isLoading ? <Loading /> : null;
}
