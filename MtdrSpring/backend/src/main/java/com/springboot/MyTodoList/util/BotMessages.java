package com.springboot.MyTodoList.util;

public enum BotMessages {
	
	HELLO_MYTODO_BOT(
	"¡Hola, soy DevBot🤖! Tu asistente personal para administrar tus tasks de DevOps.\nSelecciona una opción del menú. \n \nPuedes crear una nueva task con un mensaje, sólo escribe la siguiente información separada por punto y coma (;). \nTítulo;Descripción;Prioridad🟥🟧🟨(1,2,3);Complejidad😎🤨😰(1,2,3)"),
	BOT_REGISTERED_STARTED("DevBot registrado e inicializado exitosamente."),
	ITEM_DONE("¡Task completada! Selecciona /tasks para mostrar la lista de tasks, o /start para ir al Menu principal."), 
	ITEM_UNDONE("¡Task devuelta a lista de task pendientes! Selecciona /tasks para mostrar la lista de tasks, o /start para ir al Menu principal."), 
	ITEM_DELETED("¡Task borrada! Selecciona /tasks para mostrar la lista de tasks, o /start para ir al Menu principal."),
	TYPE_NEW_TODO_ITEM("Para crear una nueva task, escribe siguiente la información separada por punto y coma (;). Título;Descripción;Prioridad (número del 1 al 3);Complejidad (que tan complejo del 1 al 3):"),
	NEW_ITEM_ADDED("¡Task creada! Selecciona /tasks para mostrar la lista de tasks, o /start para ir al Menu principal."),
	BYE("¡Hasta luego! Selecciona /start para volver a con tu DevBot");

	private String message;

	BotMessages(String enumMessage) {
		this.message = enumMessage;
	}

	public String getMessage() {
		return message;
	}

}
