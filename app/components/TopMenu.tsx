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
        <Button color="inherit" onClick={() => router.push("/sydney")}>
          Sydney
        </Button>
        <Button color="inherit" onClick={() => router.push("/melbourne")}>
          Melbourne
        </Button>
        <Button color="inherit" onClick={() => router.push("/brisbane")}>
          Brisbane
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
