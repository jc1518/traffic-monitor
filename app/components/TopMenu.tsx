import { AppBar, Toolbar, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const TopMenu = () => {
  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" onClick={() => router.push("/")}>
          Home
        </Button>
        <Button color="inherit" onClick={() => router.push("/nsw")}>
          NSW
        </Button>
        <Button color="inherit" onClick={() => router.push("/vic")}>
          VIC
        </Button>
        <Button color="inherit" onClick={() => router.push("/qld")}>
          QLD
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
