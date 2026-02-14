import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import {getUserById} from '../src/repository/models/Users/Users'
import UserSessions from '../src/repository/models/Users/UserSessions';
import {findGsiTokenByUserId, findGsiTokenByValue} from '../src/repository/models/Users/UserGsiToken';
export default function injectSocketIO(server) {
	// ---- Socket.IO setup ----
    const io = new Server(server,
        {
        cors: {
          origin: ["http://localhost:3001"],
          credentials:true
        }, 
        connectionStateRecovery:{// the backup duration of the sessions and the packets
            maxDisconnectionDuration: 2 * 60 * 1000,
            // whether to skip middlewares upon successful recovery
            skipMiddlewares: true,
          }
    }
    );
    io.on('connection', async(socket) => {
      //joining the room
      if(socket.client_type ==='app_client'){
        const userId = socket.userId
        socket.join(`user:${userId}`)
        const userGsiClients = await findGsiTokenByUserId(userId)
        if(userGsiClients){
          userGsiClients.forEach((gsiClient)=>{
            socket.join(`user:${userId}:gsi_client_id:${gsiClient.id}`)
          })
        }
      }

  
      //joining the room for overlay
      if(socket.client_type ==='overlay_client'){
        const userId = socket.userId
        const gsiClientId = socket.gsi_client_id
        socket.join(`user:${userId}:gsi_client_id:${gsiClientId}`)
      }
      

      //event listener from game state integration client
      socket.on('gsi-client:ping', (data) => {
          const target_socket = data.target_socket
          // console.log('target socket:', target_socket)
          io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('ping',true)
        })

      socket.on('gsi-client:time', (data) => {
        const target_socket = data.target_socket
        try{
          io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('gamestate:time',data)
        }
        catch(err){
          console.log(err)
        } 
      })

      socket.on('gsi-client:draft', (data) => { 
        const target_socket = data.target_socket
        try{io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('gamestate:draft', data)}
        catch(err){
          console.log(err)
        } 
      });

      socket.on('gsi-client:strategy', (data) => { 
        const target_socket = data.target_socket
        try{
          io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('gamestate:strategy',data)}
        catch(err){
          console.log(err)
        }
        
      })

      socket.on('gsi-client:pregame',(data) => { 
        const target_socket = data.target_socket
        try{
          io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('gamestate:pregame',data)}
        catch(err){
          console.log(err)
        }
      });

      socket.on('gsi-client:ingame',(data) => { 
        const target_socket = data.target_socket
        try{
          io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('gamestate:ingame',data)
        }catch(err){
          console.log(err)
        }
      });

      socket.on('gsi-client:postgame',(data) => { 
        const target_socket = data.target_socket
        try{
          io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('gamestate:postgame',data)
        }catch(err){
          console.log(err)
        }
      });

      socket.on('gsi-client:last',(data) => { 
        const target_socket = data.target_socket
          try{
            io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('gamestate:last',data)
          }catch(err){
            console.log(err)
          }
      });
      socket.on('gsi-client:disconnect',(data) => { 
        const target_socket = data.target_socket
          try{
            io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('gamestate:disconnect',data)
          }catch(err){
            console.log(err)
          }
      });

      socket.on('gsi-client:roshan', (data) => { 
        const target_socket = data.target_socket
          try{
            io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('roshanstate',data)
          }catch(err){
            console.log(err)
          }
      });

      socket.on('gsi-client:events', (data) => { 
        const target_socket = data.target_socket
          try{
            io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('eventstate', data)
          }catch(err){
            console.log(err)
          }
      });
      socket.on('gsi-client:players',(data) =>  { 
        const target_socket = data.target_socket
          try{
            io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('players',data)
          }catch(err){
            console.log(err)
          }
      });
      socket.on('gsi-client:players:selected', (data) => { 
        const target_socket = data.target_socket
          try{
            io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('players:selected',data)
          }catch(err){
            console.log(err)
          }
      });

      socket.on('gsi-client:heroes' , (data) => { 
        const target_socket = data.target_socket
         try{
            io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('heroes',data)
          }catch(err){
            console.log(err)
          }
      });

      socket.on('gsi-client:items', (data) => { 
        const target_socket = data.target_socket
        try{
          io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('itemsstate', data)
        }catch(err){
          console.log(err)
        }
      });

      socket.on('gsi-client:added', (data) => { 
        const target_socket = data.target_socket
        try{
          io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('added',data)
        }catch(err){
          console.log(err)
        }
      });
      socket.on('gsi-client:previously', (data) => { 
        const target_socket = data.target_socket
          try{
            io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('previously')
          }catch(err){
            console.log(err)
          }
      });

      //event listener for overlay client

      socket.on('overlay-client:setting-override',(data)=>{
        const target_socket = data.target_socket
        const exclude_target_socket = data
        delete exclude_target_socket.target_socket
        try{
          io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('settings:override', exclude_target_socket)
        }catch(err){
          console.log(err)
        }
      })

      socket.on('overlay-client:toggle_music',(data)=>{
        console.log('event settings music received')
        const target_socket = data.target_socket
        try{
          io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('settings:toggle_music')
        }catch(err){
          console.log(err)
        }
      })

      socket.on('overlay-client:toggle_show_roshan',(data)=>{
        console.log('event settings show roshan overlay received')
        const target_socket = data.target_socket
        try{
          io.to(`user:${target_socket.userId}:gsi_client_id:${target_socket.gsi_client_id}`).emit('settings:toggle_show_roshan')
        }catch(err){
          console.log(err)
        }
      })
  
    
    });
    instrument(io, {
      auth: false
    });

    // socket io server middleware
    io.use(async(socket, next) => {
    const client_type = socket.handshake.auth?.client_type || socket.handshake.headers?.client_type
    const token = socket.handshake.auth?.token || socket.handshake.headers?.token
    //if socket connection from application
    if(client_type === 'app_client'){
      const session  = await UserSessions.findOne({where:{sessionToken:token}}) 
      if (session) {
        // find existing session
        const user = await getUserById(session.userId)
        socket.client_type= 'app_client'
        socket.sessionToken = session.sessionToken;
        socket.userId = user.id;
        socket.username = user.userName;
        socket.client_type ='app_client'
        return next();
      }
      return next(new Error("no session found, please re-login"));
    }
    //if socket from gsi client request
    if(client_type === 'dota_client'){
      socket.client_type ='dota_client'
      return next()
    }

    //if socket from overlay page client request
    if(client_type ==='overlay_client'){
      const overlay_client = await findGsiTokenByValue(token)
      if(overlay_client){
          socket.client_type ='overlay_client'
          socket.userId = overlay_client.userId
          socket.gsi_client_id = overlay_client.id
          return next()
      }
      return next(new Error("Invalid Overlay Token"));
    }
    
    
    //return next()
  });
	console.log('SocketIO injected');
}
