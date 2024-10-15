const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const path = require('path')
const fs = require('fs')
const menuPath = path.join(__dirname, "mensajes", "texto.txt")
const menu = fs.readFileSync(menuPath, "utf8")
const enlacesPath = path.join(__dirname, "mensajes", "enlaces.txt")
const enlaces = fs.readFileSync(enlacesPath, "utf8")




const links = addKeyword(EVENTS.ACTION).addAnswer(enlaces)

const preguntas = addKeyword(EVENTS.ACTION) .addAnswer(
    '¿Cuéntame, que trámite desearía hacer?',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state }) => {
        await state.update({ name: ctx.body })
       await flowDynamic('¡Entiendo! Para eso necesitaré tus datos.')
    }
)
.addAnswer(
    '¿Cual es tu nombre?',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state }) => {
        await state.update({ nombre: ctx.body })
    }
)
.addAnswer(
    '¿Cual es tu Rut?',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack }) => {
        if (!ctx.body.includes('-')) {
            return fallBack('El rut debe ir en ese formato xxxxxxxx-x, intente de nuevo')
          }
          else{
            await state.update({ age: ctx.body })
            const myState = state.getMyState()
          
          }
        
    }
)
.addAnswer(
    '¿Cual es tu Correo?',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack }) => {
        if (!ctx.body.includes('@')) {
            return fallBack('Email incorrecto')
          }
          else{
            await state.update({ correo: ctx.body })
            const myState = state.getMyState()
        
          }
        
    }
)
.addAnswer( 'Tus datos son ⬇ ', null, async (_, { flowDynamic, state }) => {
    const myState = state.getMyState()
   await flowDynamic(`Trámite: ${myState.name} \nNombre: ${myState.nombre} \nRut: ${myState.age}, \nCorreo: ${myState.correo}`)
})
.addAnswer('😊Gracias, enseguida un agente te contactara a la brevedad.')


const kreyol = addKeyword(EVENTS.ACTION) .addAnswer(
    'Di m, ki tramite ou ta renmen fè?',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state }) => {
        await state.update({ name: ctx.body })
       await flowDynamic('Mwen konprann! Pou sa, map bezwen enfòmasyon ou.')
    }
)
.addAnswer(
    'Ki non ou?',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state }) => {
        await state.update({ nombre: ctx.body })
    }
)
.addAnswer(
    'ki Rut ou?',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack }) => {
        if (!ctx.body.includes('-')) {
            return fallBack('ou dwe ekri rout lan nan fòm sa xxxxxxxx-x')
          }
          else{
            await state.update({ age: ctx.body })
            const myState = state.getMyState()
          
          }
        
    }
)
.addAnswer(
    'ki imèl ou?',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack }) => {
        if (!ctx.body.includes('@')) {
            return fallBack('imèl lan pa kòrèk')
          }
          else{
            await state.update({ correo: ctx.body })
            const myState = state.getMyState()
        
          }
        
    }
)
.addAnswer( 'Enfòmasyon ou se ⬇ ', null, async (_, { flowDynamic, state }) => {
    const myState = state.getMyState()
   await flowDynamic(`Trámite: ${myState.name} \nNon: ${myState.nombre} \nRut: ${myState.age}, \nimèl: ${myState.correo}`)
})
.addAnswer(' mèsi 😊, yon ajan ap kontakte ou pi vit posib.')



const menuFlow = addKeyword(["Menu", 'menu', 'hola', 'Hola', 'Buenos días', 'buenos dias', 'Freo', 'Slt', 'Salut', 'Bonswa', 'Bonjou','Yow', 'Bonjour', 'Sak gen la', 'Bonsoir'])

.addAnswer(
   
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!["1", "2", "3", "0"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones."
            );
        }
        switch (ctx.body) {
            case "1":
                return gotoFlow(preguntas);
            case "2":
                 return gotoFlow(kreyol);
            case "3":
                 return gotoFlow(links);
            case "0":
                return await flowDynamic(
                    "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu*'"
                );
        }
    }
);
const horario = addKeyword(['horario', 'ouvè']).addAnswer('Nuestro horario de atención es de lunes a viernes, de 9:00 a.m. a 5:00 p.m., y los sábados de 09:00 a.m. a 3:00 p.m. Los domingos y festivos permanecemos cerrados.')
const adress = addKeyword(['ubicacion', 'adres', 'dirección', 'direccion','direcion', 'ubicación','adrès', 'kibò local lan ye'])
    .addAnswer(
        'Nuestra oficina está ubicada en Calle Catedral 1009,Piso 7 oficina 708 Santiago, Santiago Metropolitan Region 8320000, Chile'
    )
const notaDeVoz = addKeyword(EVENTS.VOICE_NOTE).addAnswer('Por favor, no recibimos nota de voz. ¡¡Escribe lo que desea!!')
const noReconocer = addKeyword(EVENTS.WELCOME).addAnswer(['No logro entender tu mensaje. Estoy aquí para ayudarte, ¿puedes darme más detalles?', 'O escribe *menu*, para lista de tramites'])
const agradecimientos = addKeyword(['Gracias', 'gr', 'grx', 'Mèsi', 'Mesi', 'Merci']).addAnswer('¡De nada! 😊 Estoy aquí para ayudarte.')


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([menuFlow, preguntas, kreyol, agradecimientos, horario, adress])
    const adapterProvider   = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
