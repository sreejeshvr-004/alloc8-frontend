import { useState } from "react";
import api from "../api/axios";

const ForgotPassword = ()=>{
    const [email,setEmail] = useState("");
    const [msg,setMsg]=useState("");
    const [error,setError]=useState("");

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res =await api.post("/auth/forgot-password",{email});
            setMsg(res.data.message);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Error")
            
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center  bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">
                Forgot Password
            </h2>
             
             {msg && <p className="text-green-600 text-sm mb-3">{msg}</p> }
             {error && <p className="text-red-500 text-sm mb-3">{error}</p> }

             <form onSubmit={submit} className="space-y-4">
                <input 
                   type="email"
                   placeholder="Enter your email"
                   required
                   className="w-full border p-2.5 rounded"
                   value={email}
                   onChange={(e)=>setEmail(e.target.value)}                
                   />

                <button className="w-full bg-blue-600 text-white py-2.5 rounded">
                    Send Reset Link
                </button>
             </form>
        </div>
    </div>
);
};

export default ForgotPassword;