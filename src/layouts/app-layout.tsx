import { Outlet } from "react-router-dom";
import Header from "@/components/header.tsx";
import Footer from "@/components/footer.tsx";

const AppLayout = () => {
    return <div>
        <main>
            <Header />
            <Outlet />
        </main>

        <Footer />
    </div>
}

export default AppLayout;