import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  theme: 'dark' | 'light';
  activeAgent: number;
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarCollapsed: false,
    commandPaletteOpen: false,
    theme: 'dark',
    activeAgent: 1,
  } as UIState,
  reducers: {
    toggleSidebar(state) { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) { state.sidebarCollapsed = action.payload; },
    toggleCommandPalette(state) { state.commandPaletteOpen = !state.commandPaletteOpen; },
    setCommandPaletteOpen(state, action: PayloadAction<boolean>) { state.commandPaletteOpen = action.payload; },
    setTheme(state, action: PayloadAction<'dark' | 'light'>) { state.theme = action.payload; },
    setActiveAgent(state, action: PayloadAction<number>) { state.activeAgent = action.payload; },
  },
});

export const { toggleSidebar, setSidebarCollapsed, toggleCommandPalette, setCommandPaletteOpen, setTheme, setActiveAgent } = uiSlice.actions;

export const store = configureStore({
  reducer: { ui: uiSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
