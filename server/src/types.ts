export type Player = {
  id: string;
  socketId: string;
  nickname: string;
};

export type Room = {
  code: string;
  players: Player[];
};
