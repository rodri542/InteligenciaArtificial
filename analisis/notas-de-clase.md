## Inteligencia artifical

## NOTAS DE CLASE
secuencia de persepcion son los pasos que hay que seguir, que tiene que hacer el robot, cual es la estrategia
medida de rendimiento, los mejores movimientos para sacar el maximo rendimiento a lo que tienes que hacer


# Ejercicio de los 100 prisioneros
estado inicial todas las cajas cerradas, se entiende el problema como que existen 100 prisioneros que les dan la oportunidad de ser liberados si juegan un juego, consiste en que los 100 prisioneros deben entrar 1 por 1 a un cuarto con 100 cajas y tiene 50 oportunidades de encontrar su numero, si los 100 encuentran su numero seran liberados pero si 1 si quiera no lo encuentra todos son ejecutados.


Secuencia de percepcion 

Cada prisionero debera ir primero por su caja con su numero, y si no es el suyo el de adentro tomara el que esté ahi y continuara hacinedolo hasta encontrarlo o agotar sus turnos

Medida de rendimiento

Cada prisionero, primero abre el cajón con su número.
Si este cajón contiene su número, el prisionero ha concluido con éxito.
En caso contrario, el cajón contiene un número de otro prisionero, y se abre el cajón con dicho número.
El prisionero repite los pasos 2 y 3 hasta que encuentre su número o hasta abrir los 50 cajones.
Comenzando con su propio número el prisionero se garantiza de seguir una secuencia de apertura de cajones en el que pueda finalmente encontrar su número. La única cuestión reside en si la secuencia es mayor de 50.


# Ejercicio de los asesinatos hacia un lado, flabio josefo
es el problema en donde hay cierto numero de personas que ronda por ronda van asesinando al de su derecha hasta que solo quede uno, la idea es tratar de encontrar la posicion en donde siempre quedarias al ultimo y sobrevivir

Secuencia de Percepción:
Observación Inicial: Se observa un grupo de 

n personas sentadas en un círculo.
Patrón de Eliminación: Se percibe que las personas son eliminadas una por una, siguiendo un patrón donde en cada iteración se elimina al siguiente en sentido horario.
Estrategia de Supervivencia: Se comprende que para maximizar las posibilidades de supervivencia, uno debe identificar la posición inicial óptima basada en el patrón de eliminación.
Medida de Rendimiento:
Optimización de Posición: La medida de rendimiento se centra en encontrar la posición inicial que maximice las posibilidades de ser la última persona sobreviviente.
Eficiencia en la Solución: Se valora la eficiencia en el cálculo de la posición óptima, minimizando la complejidad computacional.
Validación de Estrategia: Se verifica la estrategia adoptada mediante la evaluación de resultados para diferentes valores de n.
Solución:
La estrategia para encontrar la posición óptima en la que sentarse se basa en el uso de una relación recursiva:

f(n)=(f(n−1)+1)modn

![Texto alternativo](URL_de_la_imagen)

# Notas 15/02
Comunmente co datos debemos hacer secuencias de persepcion con modelos a traves xe los datos para comprender lo que quieren decir, 
los datos tienen distints maneras de analizarce 
76 78 / 78 78
en una imagen se debe mdificar el modelo a generar, para un modelo identificar placas es complicado, es totalmente distinto, se busca un patron mediante una morfologia, buscar que patrones existen, se debe tratar de particularizar, osea identificar algo en particular, y generalizar se busca a partir de todos los datos me diga en general sepa reconocerlo y sepa identificarlo, que sea petalo o iris pues, sin decirle, identificarlo solo 


# ANALISIS DEL EJERCICIO DE COMO SERIA LA DATASET DE LA NAVE Y EL MARCIANO ESQUIVANDO LAS 3 BALAS 