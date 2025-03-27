import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Dropdown from "./Dropdown";

const Export = () => {
    const [department, setDepartment] = useState("Department");
    const [year, setYear] = useState("Select year");
    const [loader, setLoader] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    const departmentOptions = [
        "Department",
        "COMPUTER ENGINEERING",
        "ELECTRONICS AND TELECOMMUNICATION",
        "INFORMATION TECHNOLOGY",
        "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE",
        "ELECTRONICS AND COMPUTER",
    ];
    const yearOptions = ["Select year", "First Year", "Second Year", "Third Year", "Fourth Year"];

    const handleDownload = async (e) => {
        e.preventDefault();
        if (year === "Select year") {
            toast.error("Please select a valid year.", { duration: 3000 });
            return;
        }

        const params = { year };
        if (department !== "Department") params.department = department;

        try {
            setLoader(true)
            const response = await axios.get(`${backendUrl}/api/user/excel`, {
                responseType: "blob",
                params,
                headers: {
                    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                },
            });

            const contentDisposition = response.headers["content-disposition"];
            let filename = `Student_Rankings_${year.replace(/\s+/g, "_")}.xlsx`;
            if (contentDisposition) {
                const matches = contentDisposition.match(/filename="(.+)"/);
                if (matches && matches[1]) filename = matches[1];
            }

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setLoader(false)
            toast.success("File downloaded successfully!", { duration: 3000 });
        } catch (error) {
            const errorMessage =
                error.response?.data instanceof Blob
                    ? await error.response.data.text().then((text) => JSON.parse(text).error)
                    : error.message;
            toast.error(`Error: ${errorMessage || "Failed to download file"}`, { duration: 2000 });
            setLoader(false);
        }
        finally{
            setLoader(false);
        }
    };

    return (
        <>
            {loader ?
                <div className="flex flex-col gap-6 items-center justify-center mt-40 m-auto z-50">
                    <div className="loader"></div>
                </div>
                :
                <div className="w-full h-full p-8 bg-white dark:bg-zinc-800 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        Export Student Rankings
                    </h1>
                    <form onSubmit={handleDownload} className="space-y-6">
                        <Dropdown
                            label={" Year"}
                            options={yearOptions}
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                        <Dropdown
                            label={"Department (Optional)"}
                            options={departmentOptions}
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 transition duration-200"
                        >
                            Download Excel
                        </button>
                    </form>
                    <Toaster position="top-right" reverseOrder={false} />
                </div>
            }
        </>

    );
};

export default Export;