import { AppBar, Toolbar, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const TopMenu = () => {
  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" onClick={() => router.push("/inner_sydney")}>
          Inner Sydney
        </Button>
        <Button color="inherit" onClick={() => router.push("/sydney_north")}>
          Sydney North
        </Button>
        <Button color="inherit" onClick={() => router.push("/sydney_west")}>
          Sydney West
        </Button>
        <Button color="inherit" onClick={() => router.push("/sydney_south")}>
          Sydney South
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
