import type { Room, Player } from "../types.js";

const rooms = new Map<string, Room>();

function generateRoomCode()
{
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createRoom(socketId:string,nickname:string)
{

    const roomCode = generateRoomCode();
    const player: Player={
        id: crypto.randomUUID(),
        socketId,
        nickname
    }

    const room: Room = {
        code: roomCode,
        players: [player]
    }

    rooms.set(roomCode, room);
    return room;
}

export function getRoom(roomCode: string)
{
    return rooms.get(roomCode);
}


export function joinRoom(roomCode:string,socketId:string,nickname:string)
{
    const room = getRoom(roomCode);
    if (!room)
    {
        return null;
    }

    const player: Player = {
        id: crypto.randomUUID(),
        socketId,
        nickname
    }

    room.players.push(player);
    return room;
}


