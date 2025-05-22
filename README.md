def recibir_del_tcp():
    try:
        while True:
            data = tcp_socket.recv(1024).decode()
            if not data:
                print("🔌 Conexión TCP cerrada por el servidor.")
                break
            print(f"📥 TCP → Cola: {data}")
            cola_mensajes.put(data)
    except Exception as e:
        print(f"❌ Error en hilo TCP: {e}")
    finally:
        tcp_socket.close()
