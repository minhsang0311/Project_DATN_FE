import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

export const authSlice = createSlice({
    name: 'Auth',
    initialState: { user: null, token: null, tokenUser:null, expiresIn: 0 },
    reducers: {
        thoat: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenUser');
            localStorage.removeItem('user');
            localStorage.removeItem('expiresIn');
            state.user = null;
            state.token = null;
            state.tokenUser = null;
            state.expiresIn = 0;
        },
        checklogin: (state) => {
            let token = state.token;
            let tokenUser = state.tokenUser;
            let expiresIn = state.expiresIn;
            let user = state.user;
            let expiresAt = moment().add(expiresIn, 'second');
            let chuaHetHan = moment().isBefore(moment(expiresAt));
            let kq = !token && !tokenUser && !user && chuaHetHan;
            if (kq) return;
            token = localStorage.getItem('token');
            tokenUser = localStorage.getItem('tokenUser');
            user = localStorage.getItem('user');
            expiresIn = localStorage.getItem('expiresIn');
            expiresAt = moment().add(expiresIn, 'second');
            chuaHetHan = moment().isBefore(moment(expiresAt));
            if (token && tokenUser && user && chuaHetHan) {
                state.user = JSON.parse(user);
                state.token = token;
                state.tokenUser = tokenUser;
                state.expiresIn = expiresIn;
            }
        },
        dalogin: (state, param) => {
            state.token = param.payload.token;
            state.tokenUser = param.payload.tokenUser;
            state.expiresIn = 3; 
            state.user = param.payload.userInfo;
            localStorage.setItem('token', state.token);
            localStorage.setItem('tokenUser', state.tokenUser);
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('expiresIn', state.expiresIn);
        },
    },
});

export const { dalogin, thoat, checklogin } = authSlice.actions;
export default authSlice.reducer;
