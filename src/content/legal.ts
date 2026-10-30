export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "defs"; items: { term: string; text: string }[] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  id: string;
  title: string;
  updated: string;
  lead: string[];
  sections: LegalSection[];
};

export const LEGAL: LegalDocument[] = [
  {
    id: "condiciones",
    title: "Términos y Condiciones de Uso – FocusChat",
    updated: "Última actualización: 24 de octubre de 2026",
    lead: ["Lea atentamente estos Términos y Condiciones antes de utilizar nuestro servicio."],
    sections: [
      {
        id: "definiciones",
        title: "1. Interpretación y definiciones",
        blocks: [
          {
            kind: "p",
            text: "Las palabras cuya letra inicial está en mayúscula tienen los significados definidos a continuación, independientemente de si aparecen en singular o en plural.",
          },
          {
            kind: "defs",
            items: [
              {
                term: "FocusChat, la Compañía, Propietario, «nosotros» o «nos»",
                text: "FOCUS CHAT LLC, sociedad de responsabilidad limitada (Limited Liability Company) constituida conforme a las leyes del Estado de Misuri, Estados Unidos de América, con número de registro LC014789517 y domicilio en 117 S Lexington St Ste 100, Harrisonville, MO 64701-2444, Estados Unidos.",
              },
              {
                term: "Servicio o Plataforma",
                text: "La plataforma de software en línea de FocusChat que permite a desarrolladores, particulares, empresas y agencias crear, gestionar y alojar chatbots y automatizaciones de conversación.",
              },
              { term: "Sitio web", text: "FocusChat, accesible desde https://focuschat.co/" },
              {
                term: "Cliente, Usted o Usuario",
                text: "La persona natural, o la empresa u otra entidad legal en nombre de la cual dicha persona accede o utiliza el Servicio.",
              },
              { term: "Usuarios Finales", text: "Las personas que interactúan con los chatbots creados por el Cliente." },
              { term: "Cuenta", text: "La cuenta única creada para acceder al Servicio o a partes del mismo." },
              { term: "Suscripción", text: "El plan de pago mensual o anual que el Cliente contrata para usar el Servicio." },
              {
                term: "Servicios de Terceros",
                text: "Cualquier servicio, plataforma, canal de comunicación o herramienta de inteligencia artificial que no sea propiedad de FocusChat ni esté controlado por ella, incluidos, sin limitarse a, WhatsApp, Instagram, Messenger, Telegram, ChatGPT, Claude, Stripe y similares.",
              },
              {
                term: "Dispositivo",
                text: "Cualquier dispositivo que pueda acceder al Servicio, como una computadora, un teléfono celular o una tableta.",
              },
              {
                term: "Términos y Condiciones o Términos",
                text: "Estos Términos y Condiciones, que forman el acuerdo completo entre Usted y la Compañía respecto del uso del Servicio.",
              },
              { term: "País", text: "Estados Unidos de América." },
            ],
          },
        ],
      },
      {
        id: "aceptacion",
        title: "2. Aceptación y reconocimiento",
        blocks: [
          {
            kind: "p",
            text: "Al hacer clic en el botón «Acepto», registrarse para obtener una Cuenta, utilizar el Servicio o participar en cualquier interacción facilitada por el Servicio, Usted reconoce y acepta estar sujeto a estos Términos. Si no está de acuerdo con alguna parte de ellos, debe abstenerse de acceder o utilizar el Servicio.",
          },
          {
            kind: "p",
            text: "Su acceso y uso del Servicio están condicionados a su aceptación y cumplimiento de estos Términos y de nuestra Política de Privacidad, que describe cómo recopilamos, usamos y divulgamos su información personal. Estos Términos se aplican a todos los visitantes, usuarios y demás personas que accedan o utilicen el Servicio.",
          },
          {
            kind: "p",
            text: "Usted declara ser mayor de 18 años. La Compañía no permite que los menores de 18 años utilicen el Servicio. Si actúa en nombre de una empresa, declara tener la autoridad para obligarla a estos Términos.",
          },
        ],
      },
      {
        id: "servicio",
        title: "3. Descripción del Servicio",
        blocks: [
          {
            kind: "p",
            text: "FocusChat proporciona herramientas tecnológicas para que el Cliente diseñe, publique y administre chatbots y flujos de automatización. FocusChat actúa únicamente como un puente tecnológico entre la Plataforma y el Cliente: no es parte de las conversaciones entre el Cliente y sus Usuarios Finales ni de las relaciones comerciales que el Cliente establezca con ellos.",
          },
          {
            kind: "p",
            text: "Alcance de estos Términos. Estos Términos regulan exclusivamente el acceso y uso de la Plataforma. Cualquier otro servicio que FocusChat preste al Cliente, incluidos los servicios de publicidad digital o gestión de tráfico pago, se rige por un contrato independiente firmado entre las partes. En caso de conflicto, para ese servicio prevalecerá lo dispuesto en su contrato específico.",
          },
        ],
      },
      {
        id: "cuenta",
        title: "4. Registro y seguridad de la Cuenta",
        blocks: [
          {
            kind: "p",
            text: "Para usar el Servicio debe crear una Cuenta con información veraz y actualizada. Usted es responsable de mantener la confidencialidad de sus credenciales y de toda actividad que ocurra bajo su Cuenta. Debe notificarnos de inmediato a focuschat.info@gmail.com si detecta un uso no autorizado.",
          },
        ],
      },
      {
        id: "pagos",
        title: "5. Planes, prueba gratuita y pagos",
        blocks: [
          {
            kind: "p",
            text: "5.1 Suscripción. El Servicio se ofrece mediante Suscripción mensual o anual. El Cliente elige libremente el plan que prefiera y no existe cláusula de permanencia ni plazo mínimo de contratación.",
          },
          {
            kind: "p",
            text: "5.2 Prueba gratuita. FocusChat ofrece una prueba gratuita de 7 días. Al finalizar la prueba, si el Cliente no ha cancelado, la Suscripción elegida comenzará a cobrarse según el plan seleccionado.",
          },
          {
            kind: "p",
            text: "5.3 Procesamiento de pagos. Los pagos se procesan a través de Stripe, un proveedor externo de servicios de pago. Al pagar, Usted acepta también los términos y políticas de Stripe. FocusChat no almacena los datos completos de su tarjeta; estos son tratados directamente por Stripe.",
          },
          {
            kind: "p",
            text: "5.4 Moneda. Todos los precios y cobros se expresan y se realizan en dólares estadounidenses (USD). Su banco o emisor de tarjeta podría aplicar comisiones o tasas de conversión de moneda, de las cuales FocusChat no es responsable.",
          },
          {
            kind: "p",
            text: "5.5 Renovación. La Suscripción se renueva automáticamente al final de cada período (mensual o anual) hasta que el Cliente la cancele.",
          },
          {
            kind: "p",
            text: "5.6 Cambios de precio. FocusChat podrá modificar los precios de los planes notificándolo con antelación razonable. El nuevo precio aplicará a partir del siguiente período de facturación.",
          },
          {
            kind: "p",
            text: "5.7 Impuestos. Los precios podrían no incluir impuestos aplicables. El Cliente es responsable de los impuestos que correspondan según su jurisdicción.",
          },
        ],
      },
      {
        id: "cancelacion",
        title: "6. Cancelación y política de no reembolso",
        blocks: [
          {
            kind: "p",
            text: "6.1 Cancelación. El Cliente puede cancelar su Suscripción en cualquier momento, sin penalización y sin cláusula de permanencia, desde la configuración de su Cuenta o contactándonos en focuschat.info@gmail.com. La cancelación evita cobros futuros y el acceso se mantiene hasta el final del período ya pagado.",
          },
          {
            kind: "p",
            text: "6.2 No hay reembolsos. El Cliente reconoce y acepta expresamente que en ningún caso FocusChat realiza reembolsos de dinero, ya sea por pagos mensuales, anualidades, renovaciones, períodos parcialmente utilizados o por falta de uso de la Plataforma. El Cliente puede dejar de usar la Plataforma cuando lo desee, pero los pagos ya realizados no son reembolsables.",
          },
          {
            kind: "p",
            text: "6.3 Prueba gratuita. El Cliente es responsable de cancelar antes de que termine la prueba de 7 días si no desea ser cobrado.",
          },
          {
            kind: "p",
            text: "6.4 Contracargos. Al aceptar estos Términos, el Cliente declara conocer la presente política. Los contracargos o disputas de pago iniciados sin haber contactado previamente a FocusChat podrán dar lugar a la suspensión de la Cuenta.",
          },
        ],
      },
      {
        id: "integraciones",
        title: "7. Integraciones y Servicios de Terceros",
        blocks: [
          {
            kind: "p",
            text: "El Cliente puede conectar a la Plataforma las redes sociales, canales de comunicación y herramientas que desee, así como integrar por su cuenta modelos de inteligencia artificial como ChatGPT, Claude o el de su preferencia. Al respecto:",
          },
          {
            kind: "list",
            items: [
              "Todas las integraciones son independientes y por separado de la Suscripción de FocusChat.",
              "Los costos de dichas integraciones (por ejemplo, el consumo de la API de un modelo de IA, o las tarifas de mensajería de un canal) son pagos aparte, a cargo exclusivo del Cliente y se rigen por los acuerdos que el Cliente tenga con cada proveedor.",
              "FocusChat no controla, no es responsable ni garantiza la disponibilidad, precisión, políticas, precios o conducta de los Servicios de Terceros, ni cualquier daño o pérdida derivados de su uso.",
              "El Cliente debe cumplir los términos y políticas de cada Servicio de Terceros que conecte. El incumplimiento de dichos términos puede ocasionar el bloqueo de sus cuentas por parte del tercero, sin responsabilidad para FocusChat.",
            ],
          },
        ],
      },
      {
        id: "contenido",
        title: "8. Contenido del Cliente y respuestas de inteligencia artificial",
        blocks: [
          {
            kind: "p",
            text: "El Cliente conserva la propiedad de los contenidos, datos y configuraciones que cargue en la Plataforma y nos otorga una licencia limitada para alojarlos y procesarlos únicamente con el fin de prestar el Servicio.",
          },
          {
            kind: "p",
            text: "El Cliente es el único responsable del contenido de sus chatbots, de las conversaciones con sus Usuarios Finales y de contar con las autorizaciones necesarias de dichos Usuarios Finales para tratar sus datos. Las respuestas generadas por herramientas de inteligencia artificial pueden contener errores o imprecisiones; el Cliente debe revisarlas y asume la responsabilidad por su uso.",
          },
        ],
      },
      {
        id: "prohibidos",
        title: "9. Usos prohibidos",
        blocks: [
          {
            kind: "p",
            text: "Los Usuarios no podrán utilizar el Servicio para actividades ilícitas, acoso, envío de correo no deseado o violación de derechos de terceros. Algunos ejemplos de actividades prohibidas incluyen, entre otras:",
          },
          {
            kind: "list",
            items: ["Carga de código malicioso.", "Enviar mensajes no solicitados.", "Interferir con las operaciones de la Plataforma."],
          },
          {
            kind: "p",
            text: "Las infracciones pueden conllevar la suspensión o la cancelación de la Cuenta sin derecho a reembolso.",
          },
        ],
      },
      {
        id: "propiedad",
        title: "10. Propiedad intelectual",
        blocks: [
          {
            kind: "p",
            text: "El Servicio, su software, diseño, marca, logotipos y contenidos originales son y seguirán siendo propiedad exclusiva de FocusChat y sus licenciantes. Estos Términos no le otorgan derecho alguno sobre nuestras marcas ni sobre la tecnología subyacente, salvo el derecho limitado, revocable y no transferible de usar el Servicio conforme a estos Términos.",
          },
        ],
      },
      {
        id: "enlaces",
        title: "11. Enlaces a otros sitios web",
        blocks: [
          {
            kind: "p",
            text: "Nuestro Servicio puede contener enlaces a sitios web o servicios de terceros que no son propiedad de la Compañía ni están controlados por ella. La Compañía no tiene control ni asume responsabilidad alguna sobre su contenido, políticas de privacidad o prácticas, y no será responsable, directa ni indirectamente, de ningún daño o pérdida causados o supuestamente causados por el uso o la confianza depositada en dicho contenido, bienes o servicios. Le recomendamos leer los términos y las políticas de privacidad de cualquier sitio de terceros que visite.",
          },
        ],
      },
      {
        id: "riesgos",
        title: "12. Riesgos de las transacciones en línea",
        blocks: [
          {
            kind: "p",
            text: "El Cliente reconoce que, al tratarse de operaciones realizadas por medios digitales y no tradicionales, existen riesgos de fraude, suplantación, incumplimientos, demoras y otras situaciones ajenas a FocusChat. FocusChat hará esfuerzos razonables para proteger la Plataforma, pero no responde por hechos u omisiones entre el Cliente, sus Usuarios Finales o terceros, tales como fraudes, suplantaciones o incumplimientos contractuales.",
          },
        ],
      },
      {
        id: "terminacion",
        title: "13. Terminación",
        blocks: [
          {
            kind: "p",
            text: "Podemos rescindir o suspender su acceso de inmediato, sin previo aviso ni responsabilidad alguna, por cualquier motivo, incluyendo, entre otros, el incumplimiento de estos Términos. Tras la rescisión, su derecho a utilizar el Servicio cesará de inmediato y FocusChat se reserva el derecho de eliminar todos los datos asociados, conforme a lo indicado en la Política de Privacidad.",
          },
          {
            kind: "p",
            text: "Usted puede cancelar su Cuenta en cualquier momento según lo previsto en la sección 6, o escribiendo a focuschat.info@gmail.com.",
          },
        ],
      },
      {
        id: "indemnizacion",
        title: "14. Indemnización",
        blocks: [
          { kind: "p", text: "Usted acepta indemnizar y mantener indemne a FocusChat, a sus miembros y afiliados frente a reclamos, pérdidas o responsabilidades que surjan de:" },
          {
            kind: "list",
            items: [
              "Su uso del Servicio.",
              "El incumplimiento de estos Términos.",
              "La infracción de leyes o reglamentos aplicables, o de derechos de terceros.",
            ],
          },
        ],
      },
      {
        id: "responsabilidad",
        title: "15. Limitación de responsabilidad",
        blocks: [
          {
            kind: "p",
            text: "Sin perjuicio de los daños que Usted pueda sufrir, la responsabilidad total de la Compañía y de cualquiera de sus proveedores en virtud de cualquier disposición de estos Términos, y su único recurso para todo lo anterior, se limitará al importe realmente pagado por Usted a través del Servicio o a 100 USD si no ha comprado nada a través del Servicio.",
          },
          {
            kind: "p",
            text: "En la máxima medida permitida por la ley aplicable, en ningún caso la Compañía o sus proveedores serán responsables por daños especiales, incidentales, indirectos o consecuenciales de cualquier tipo, incluidos, entre otros, daños por pérdida de ganancias, pérdida de datos u otra información, interrupción del negocio, lesiones personales o pérdida de privacidad, que surjan del uso o la imposibilidad de usar el Servicio, del software o hardware de terceros utilizados con él, o de cualquier otra manera en relación con estos Términos, incluso si la Compañía ha sido informada de la posibilidad de tales daños.",
          },
          {
            kind: "p",
            text: "Algunas jurisdicciones no permiten la exclusión de garantías implícitas ni la limitación de responsabilidad por daños incidentales o consecuenciales, por lo que algunas de las limitaciones anteriores podrían no aplicarse a Usted. En ese caso, la responsabilidad de cada parte se limitará al máximo permitido por la ley.",
          },
        ],
      },
      {
        id: "descargo",
        title: "16. Descargo de responsabilidad «TAL CUAL» y «SEGÚN DISPONIBILIDAD»",
        blocks: [
          {
            kind: "p",
            text: "El Servicio se le proporciona «TAL CUAL» y «SEGÚN DISPONIBILIDAD» y con todos sus fallos y defectos, sin garantía de ningún tipo. En la máxima medida permitida por la ley aplicable, la Compañía, en su propio nombre y en el de sus afiliadas, licenciantes y proveedores, renuncia expresamente a todas las garantías, expresas, implícitas, legales o de otro tipo, incluidas las garantías implícitas de comerciabilidad, idoneidad para un propósito particular, titularidad y no infracción.",
          },
          {
            kind: "p",
            text: "Sin limitar lo anterior, la Compañía no garantiza que el Servicio cumpla sus requisitos, logre los resultados previstos, sea compatible con otro software o sistema, funcione sin interrupciones, cumpla estándares de rendimiento o confiabilidad, esté libre de errores, virus, malware u otros componentes dañinos, ni que cualquier error pueda o vaya a ser corregido. Tampoco garantiza la exactitud, confiabilidad o actualidad de la información o el contenido generado a través del Servicio, incluido el generado por inteligencia artificial.",
          },
          {
            kind: "p",
            text: "Algunas jurisdicciones no permiten la exclusión de ciertos tipos de garantías ni las limitaciones a los derechos legales del consumidor, por lo que algunas o todas las exclusiones anteriores podrían no aplicarse a Usted. En tal caso, se aplicarán en la mayor medida permitida por la ley.",
          },
        ],
      },
      {
        id: "ley",
        title: "17. Ley aplicable y jurisdicción",
        blocks: [
          {
            kind: "p",
            text: "Estos Términos y el uso del Servicio se regirán por las leyes del Estado de Misuri, Estados Unidos de América, excluyendo sus normas sobre conflicto de leyes. Su uso del Servicio también puede estar sujeto a otras leyes locales, estatales, nacionales o internacionales aplicables.",
          },
        ],
      },
      {
        id: "disputas",
        title: "18. Resolución de disputas",
        blocks: [
          {
            kind: "p",
            text: "Si tiene alguna inquietud o disputa relacionada con el Servicio, acepta intentar primero resolverla de manera informal contactando a la Compañía en focuschat.info@gmail.com. Si no se logra una solución, la disputa se someterá a los tribunales competentes del Estado de Misuri, Estados Unidos, salvo que la ley imperativa de su país de residencia disponga otra cosa.",
          },
        ],
      },
      {
        id: "union-europea",
        title: "19. Para usuarios de la Unión Europea (UE)",
        blocks: [
          {
            kind: "p",
            text: "Si usted es consumidor de la Unión Europea, se beneficiará de las disposiciones obligatorias de la legislación del país en el que reside.",
          },
        ],
      },
      {
        id: "cumplimiento-eeuu",
        title: "20. Cumplimiento legal de los Estados Unidos",
        blocks: [
          {
            kind: "p",
            text: "Usted declara y garantiza que (i) no se encuentra en un país sujeto al embargo del gobierno de los Estados Unidos, o designado por este como país que «apoya el terrorismo», y (ii) no figura en ninguna lista del gobierno de los Estados Unidos de personas prohibidas o restringidas.",
          },
        ],
      },
      {
        id: "divisibilidad",
        title: "21. Divisibilidad y renuncia",
        blocks: [
          {
            kind: "p",
            text: "Divisibilidad. Si alguna disposición de estos Términos se considera inaplicable o inválida, dicha disposición se modificará e interpretará para lograr sus objetivos en la mayor medida posible según la ley aplicable, y las restantes continuarán en pleno vigor y efecto.",
          },
          {
            kind: "p",
            text: "Renuncia. La falta de ejercicio de un derecho o de exigencia del cumplimiento de una obligación en virtud de estos Términos no afectará la capacidad de una parte para ejercerlo o exigirlo en cualquier momento posterior, ni la renuncia a un incumplimiento constituirá renuncia a cualquier incumplimiento posterior.",
          },
        ],
      },
      {
        id: "traduccion",
        title: "22. Traducción e interpretación",
        blocks: [
          {
            kind: "p",
            text: "Estos Términos pueden haber sido traducidos si los ponemos a su disposición en nuestro Servicio. Usted acepta que, en caso de disputa o diferencia de interpretación, prevalecerá la versión original en español.",
          },
        ],
      },
      {
        id: "modificaciones",
        title: "23. Modificaciones a estos Términos",
        blocks: [
          {
            kind: "p",
            text: "Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Si la modificación es sustancial, haremos todo lo posible por notificarle con al menos 30 días de antelación antes de que entren en vigor los nuevos términos; lo que constituye un cambio sustancial se determinará a nuestra entera discreción.",
          },
          {
            kind: "p",
            text: "Al continuar accediendo o utilizando el Servicio después de que las revisiones entren en vigor, Usted acepta regirse por los términos revisados. Si no está de acuerdo con los nuevos términos, en su totalidad o en parte, deje de usar el sitio web y el Servicio.",
          },
        ],
      },
      {
        id: "contacto-terminos",
        title: "24. Contáctenos",
        blocks: [
          { kind: "p", text: "Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos:" },
          {
            kind: "list",
            items: [
              "Visitando nuestro sitio web: https://focuschat.co/",
              "Por correo electrónico: focuschat.info@gmail.com",
              "FOCUS CHAT LLC · 117 S Lexington St Ste 100, Harrisonville, MO 64701-2444, Estados Unidos",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "privacidad",
    title: "Política de Privacidad – FocusChat",
    updated: "Última actualización: 24 de octubre de 2026",
    lead: [
      "Esta Política de Privacidad describe nuestras políticas y procedimientos sobre la recopilación, el uso y la divulgación de su información cuando utiliza el Servicio, y le informa sobre sus derechos de privacidad y cómo la ley lo protege. Utilizamos sus datos personales para proporcionar y mejorar el Servicio. Al utilizarlo, Usted acepta la recopilación y el uso de información de acuerdo con esta Política.",
      "En FOCUS CHAT LLC («FocusChat», «nosotros», «nuestro»), la privacidad y la seguridad de los datos personales son una de nuestras máximas prioridades. Esta Política explica cómo tratamos los datos personales de nuestros clientes, sus usuarios finales y representantes, usuarios del sitio web, clientes potenciales y socios comerciales. Se aplica a la información recopilada a través de la plataforma FocusChat y de nuestro sitio web https://focuschat.co/.",
    ],
    sections: [
      {
        id: "privacidad-definiciones",
        title: "1. Interpretación y definiciones",
        blocks: [
          {
            kind: "defs",
            items: [
              { term: "Cuenta", text: "Cuenta única creada para que Usted acceda a nuestro Servicio o a partes de él." },
              {
                term: "La Compañía",
                text: "FOCUS CHAT LLC, sociedad de responsabilidad limitada de Misuri, Estados Unidos, con domicilio en 117 S Lexington St Ste 100, Harrisonville, MO 64701-2444.",
              },
              {
                term: "Cookies",
                text: "Pequeños archivos que un sitio web coloca en su dispositivo y que contienen, entre otros, detalles de su historial de navegación en ese sitio.",
              },
              { term: "País", text: "Estados Unidos de América." },
              {
                term: "Dispositivo",
                text: "Cualquier dispositivo que pueda acceder al Servicio, como una computadora, un teléfono celular o una tableta.",
              },
              { term: "Datos personales", text: "Cualquier información que se refiera a una persona física identificada o identificable." },
              { term: "Servicio", text: "La plataforma FocusChat y su sitio web." },
              {
                term: "Proveedor de servicios",
                text: "Persona natural o jurídica que trata datos en nombre de la Compañía (por ejemplo, procesadores de pago, alojamiento, analítica o soporte).",
              },
              {
                term: "Datos de uso",
                text: "Datos recopilados automáticamente al usar el Servicio (por ejemplo, la duración de la visita a una página).",
              },
              {
                term: "Usted",
                text: "La persona que accede o utiliza el Servicio, o la empresa u otra entidad legal en nombre de la cual lo hace.",
              },
            ],
          },
        ],
      },
      {
        id: "datos-recopilados",
        title: "2. Datos que recopilamos",
        blocks: [
          {
            kind: "p",
            text: "Datos personales. Al utilizar el Servicio podemos solicitarle información que permita contactarlo o identificarlo, como: dirección de correo electrónico, nombre y apellido, datos de facturación y Datos de uso.",
          },
          {
            kind: "p",
            text: "Datos de pago. Los pagos se procesan a través de Stripe. FocusChat no almacena los datos completos de su tarjeta; estos son tratados directamente por Stripe conforme a su propia política de privacidad.",
          },
          {
            kind: "p",
            text: "Datos de uso. Se recopilan automáticamente e incluyen la dirección IP, el tipo y versión del navegador, las páginas visitadas, la fecha y hora de la visita, el tiempo en esas páginas, identificadores únicos del dispositivo y otros datos de diagnóstico. Si accede desde un dispositivo móvil, podemos recopilar el tipo de dispositivo, su identificador, sistema operativo y navegador.",
          },
          {
            kind: "p",
            text: "Datos de las integraciones. Cuando el Cliente conecta canales de comunicación (por ejemplo, WhatsApp, Instagram o Messenger) o herramientas de inteligencia artificial, la Plataforma puede procesar los mensajes y datos de los Usuarios Finales que circulen por dichas integraciones, únicamente para prestar el Servicio. En esos casos, el Cliente actúa como responsable de esos datos y FocusChat como proveedor que los trata por su cuenta.",
          },
        ],
      },
      {
        id: "cookies",
        title: "3. Cookies y tecnologías de seguimiento",
        blocks: [
          {
            kind: "p",
            text: "Utilizamos cookies y tecnologías similares (balizas web, etiquetas y scripts) para monitorizar la actividad del Servicio, almacenar cierta información y mejorarlo. Puede configurar su navegador para rechazar las cookies, aunque algunas partes del Servicio podrían dejar de funcionar. Usamos:",
          },
          {
            kind: "list",
            items: [
              "Cookies necesarias (de sesión): esenciales para prestar el Servicio, autenticar usuarios y prevenir el uso fraudulento de cuentas.",
              "Cookies de aceptación (persistentes): identifican si Usted aceptó el uso de cookies.",
              "Cookies de funcionalidad (persistentes): recuerdan sus preferencias, como el idioma o los datos de inicio de sesión.",
            ],
          },
        ],
      },
      {
        id: "uso-datos",
        title: "4. Cómo usamos sus datos personales",
        blocks: [
          { kind: "p", text: "Podemos utilizar los datos personales para:" },
          {
            kind: "list",
            items: [
              "Proporcionar y mantener el Servicio, incluido el monitoreo de su uso.",
              "Administrar su Cuenta y su registro como usuario.",
              "Ejecutar el contrato: gestión de la Suscripción, facturación y cobros.",
              "Contactarlo por correo electrónico u otros medios sobre actualizaciones, seguridad y comunicaciones relacionadas con el Servicio.",
              "Brindar soporte y gestionar sus solicitudes.",
              "Enviarle noticias, ofertas e información sobre servicios similares a los que ya contrató, salvo que haya optado por no recibirlas.",
              "Seguridad, prevención de fraude y cumplimiento de obligaciones legales.",
              "Transferencias comerciales: evaluar o llevar a cabo una fusión, venta o reestructuración en la que los datos formen parte de los activos transferidos.",
              "Análisis de datos, identificación de tendencias de uso y mejora del Servicio y de su experiencia.",
            ],
          },
          {
            kind: "p",
            text: "Cuando la ley aplicable lo exija, el tratamiento se basará en la ejecución del contrato, nuestros intereses legítimos, el cumplimiento de obligaciones legales o su consentimiento, que puede retirar en cualquier momento.",
          },
        ],
      },
      {
        id: "google",
        title: "5. Datos de Google y de otras integraciones",
        blocks: [
          {
            kind: "p",
            text: "Si el Cliente conecta servicios como Google Calendar, Google Sheets o Gmail, accedemos únicamente a los datos que autorice, para ofrecer las funciones que solicite. No vendemos esos datos ni los usamos para publicidad. El Cliente puede revocar el acceso en cualquier momento desde la configuración de su cuenta de Google o desconectando la integración en FocusChat. El uso de información recibida de las API de Google cumple con la Política de datos de usuario de los servicios de API de Google, incluidos sus requisitos de uso limitado.",
          },
        ],
      },
      {
        id: "compartir",
        title: "6. Cómo compartimos los datos personales",
        blocks: [
          { kind: "p", text: "No vendemos datos personales. Solo compartimos información en estas circunstancias:" },
          {
            kind: "list",
            items: [
              "Proveedores de servicios: como Stripe (pagos), alojamiento en la nube, analítica y atención al cliente, que solo acceden a los datos para realizar tareas en nuestro nombre.",
              "Asesores profesionales: abogados, auditores y consultores, para fines legales y comerciales.",
              "Integraciones vinculadas: herramientas de terceros que el Cliente conecta (por ejemplo, redes sociales o modelos de IA). Ese intercambio se rige por los acuerdos del Cliente con cada proveedor.",
              "Requerimientos legales: cuando la ley lo exija o para proteger nuestros derechos y seguridad, con autoridades competentes.",
              "Transacciones corporativas: en caso de fusión, adquisición o venta de activos. Le notificaremos antes de que sus datos queden sujetos a una política de privacidad distinta.",
            ],
          },
        ],
      },
      {
        id: "transferencia",
        title: "7. Transferencia internacional de datos",
        blocks: [
          {
            kind: "p",
            text: "Su información se procesa en nuestras oficinas y en cualquier otro lugar donde se encuentren las partes involucradas en el tratamiento, por lo que puede transferirse y almacenarse en ordenadores ubicados fuera de su estado, provincia o país, incluido Estados Unidos, donde las leyes de protección de datos pueden diferir de las de su jurisdicción. Su consentimiento a esta Política, seguido del envío de la información, representa su aceptación de dicha transferencia. Tomaremos las medidas razonables para que sus datos se traten de forma segura y conforme a esta Política.",
          },
        ],
      },
      {
        id: "retencion",
        title: "8. Retención de datos",
        blocks: [
          {
            kind: "p",
            text: "Conservamos los datos personales únicamente durante el tiempo necesario para cumplir con los fines descritos en esta Política, a menos que la ley exija o permita un período de conservación más prolongado. Los criterios que utilizamos para determinar nuestros períodos de conservación incluyen la naturaleza de nuestra relación con Usted, las obligaciones legales y la posible necesidad de defendernos ante reclamaciones legales.",
          },
          {
            kind: "p",
            text: "Los datos de Google y los tokens de autorización que almacenamos se conservan solo durante el tiempo necesario para prestar nuestros servicios o cumplir con las obligaciones legales.",
          },
        ],
      },
      {
        id: "seguridad",
        title: "9. Seguridad de sus datos",
        blocks: [
          {
            kind: "p",
            text: "La seguridad de sus datos es importante para nosotros, pero ningún método de transmisión por internet ni de almacenamiento electrónico es 100% seguro. Aunque nos esforzamos por usar medios comercialmente aceptables para protegerlos, no podemos garantizar su seguridad absoluta.",
          },
        ],
      },
      {
        id: "derechos",
        title: "10. Sus derechos y opciones",
        blocks: [
          { kind: "p", text: "Según su ubicación, Usted puede:" },
          {
            kind: "list",
            items: [
              "Acceder, corregir, actualizar o eliminar sus datos personales.",
              "Restringir u oponerse a ciertos tratamientos.",
              "Solicitar portabilidad de sus datos en un formato estructurado y legible por máquina, cuando proceda.",
              "Retirar su consentimiento en cualquier momento, cuando el tratamiento se base en él. La revocación no aplica cuando exista un deber legal o contractual de conservar la información.",
              "Presentar una queja ante la autoridad de protección de datos de su jurisdicción.",
            ],
          },
          {
            kind: "p",
            text: "Para ejercer estos derechos escríbanos a focuschat.info@gmail.com indicando su nombre, una descripción clara de su solicitud y un correo para responderle. Responderemos conforme a la ley aplicable y, en todo caso, en un plazo razonable. También puede actualizar o eliminar su información desde la configuración de su Cuenta. Es posible que debamos conservar cierta información cuando exista una obligación legal o base jurídica para hacerlo.",
          },
        ],
      },
      {
        id: "divulgacion",
        title: "11. Divulgación por motivos legales",
        blocks: [
          {
            kind: "p",
            text: "Podemos divulgar sus datos personales si la ley lo exige, ante solicitudes válidas de autoridades públicas o si creemos de buena fe que es necesario para cumplir una obligación legal, proteger los derechos o la propiedad de la Compañía, prevenir o investigar posibles irregularidades, proteger la seguridad de los Usuarios o del público, o protegernos frente a responsabilidad legal.",
          },
        ],
      },
      {
        id: "menores",
        title: "12. Privacidad de los menores",
        blocks: [
          {
            kind: "p",
            text: "Nuestro Servicio no está dirigido a menores de 18 años y no recopilamos intencionalmente información personal de ellos. Si es padre, madre o tutor y sabe que su hijo/a nos proporcionó datos personales, contáctenos y los eliminaremos de nuestros servidores.",
          },
        ],
      },
      {
        id: "enlaces-privacidad",
        title: "13. Enlaces a otros sitios web",
        blocks: [
          {
            kind: "p",
            text: "Nuestro Servicio puede contener enlaces a sitios que no operamos. Si hace clic en un enlace de un tercero, será redirigido a su sitio. Le recomendamos revisar la política de privacidad de cada sitio que visite; no tenemos control ni asumimos responsabilidad por su contenido o prácticas.",
          },
        ],
      },
      {
        id: "cambios-privacidad",
        title: "14. Cambios en esta Política",
        blocks: [
          {
            kind: "p",
            text: "Podemos actualizar esta Política periódicamente. Publicaremos la nueva versión en esta página, le informaremos por correo electrónico o mediante un aviso destacado en el Servicio antes de que el cambio entre en vigor y actualizaremos la fecha de «Ultima actualización». Le recomendamos revisarla periódicamente.",
          },
        ],
      },
      {
        id: "contacto-privacidad",
        title: "15. Contáctenos",
        blocks: [
          { kind: "p", text: "Si tiene preguntas sobre esta Política de Privacidad:" },
          {
            kind: "list",
            items: [
              "Sitio web: https://focuschat.co/",
              "Correo electrónico: focuschat.info@gmail.com",
              "FOCUS CHAT LLC · 117 S Lexington St Ste 100, Harrisonville, MO 64701-2444, Estados Unidos",
            ],
          },
        ],
      },
    ],
  },
];
