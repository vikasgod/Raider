import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { IUser } from '@/models/user.model';

interface IUserState {
  userData: IUser | null
}

const initialState: IUserState = {
  userData: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    addUser: (state, action) => {
      state.userData.push(action.payload)
    },
    clearUserData: (state) => {
      state.userData = []
    },
  },
})

export const { setUserData, addUser, clearUserData } = userSlice.actions

export default userSlice.reducer