import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
  IconButton,
} from "@mui/material";
import { useInputValidation } from "6pp";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
import toast from "react-hot-toast";
import { useAsyncMutation } from "../../hooks/hook";
import UserItem from "../shared/UserItem";
import { setIsSearch } from "../../redux/reducers/misc";

const Search = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const search = useInputValidation("");
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery(); //trigger,object like isloading,data,isError
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler} PaperProps={{ style: { borderRadius: "15px" } }}>
      <Stack p={"2rem"} direction={"column"} width={"30rem"} spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <DialogTitle>Find People</DialogTitle>
          <IconButton onClick={searchCloseHandler}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <TextField
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          placeholder="Search for users..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            style: { borderRadius: "25px" },
          }}
          sx={{ mb: 2 }}
        />

        <List>
          {users.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
