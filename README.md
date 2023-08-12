# Testing de componentes con TestBed

1. [Introducción](#id1)

    1.1. [Entonces, ¿por qué TestBed y no Spectator?](#id1.1)

2. [Pero antes, ¿qué es TestBed?](#id2)

3. [Configurar el módulo del componente a testear](#id3)

    3.1 [Creación del componente](#id3.1)

    3.2 [Dos partes de una: fixture y component](#id3.2)

4. [Primeros pasos](#id4)

    4.1 [Iniciar el ciclo de vida del componente](#id4.1)

    4.2 [Convirtiendo nuestro test unitario en un test de integración](#id4.2)

5. [Testing de dos o más componentes](#id5)

    5.1 [Replicando el comportamiento de nuestro componente a testear](#id5.1)

    5.2 [Montando el componente PostComponent](#id5.2)

    5.2.1 [Testeando el componente tal cual está](#id5.2.1)

    5.2.2 [Probando escenarios: sobreescribir propiedades internas.](#id5.2.2)

5.3 [Test de props como inputs](#id5.3)

5.4 [Un nuevo enfoque: Testeando con un HostComponent](#id5.4)

  5.4.1 [Cambiando el punto de vista: Viéndolo _desde_ el padre](#id5.4.1)

<hr>

### Nuevo!

6. [Test de rutas: RouterTestingHarness](#id6)

    6.1 [Algunos cambios](#id6.1)

6.2 [¿Qué es RouterTestingHarness?](#id6.2)

6.3 [Configuración del Router](#id6.3)

6.4 [Objetivo del test](#id6.4)

6.5 [Preparación del escenario](#id6.5)

6.6 [Ejecución](#id6.6)

6.6.1 [Extra: comprobación de la url](#id6.6.1)

<hr>

## 1. Introducción

<hr>

<div id='id1' />


La primera pregunta a responder sería: **¿Por qué la necesidad de este tutorial?**.
Necesidad ninguna, porque creo que en internet es posible encontrar mejores y guías más completas
que ayuden a la **comprensión** de TestBed. Sin embargo, es cierto varios factores:

1. Encontrar y agrupar esa documentación es **costoso**. Mucha de la que se puede encontrar es antigua (testing de versiones anteriores a Angular 14 y el **nuevo** TestBed **mejorado**).
2. Mucha documentación está **repetida** y apenas profundiza en conceptos interesantes.
3. La documentación oficial **deja bastante que desear**.

Llevo 2 años desarrollando con Angular, y mi primera herramienta de testing fue con **Spectator**, la cual me ha ayudado
enormemente a **comprender** cómo funciona realmente (o cómo quiere el equipo de Angular que funcione) los testings de su framework.
Basándome en mi propia experiencia, mis propios intentos, fallos y errores, mis propias correcciones y todo el conocimiento que he ido
recogiendo durante estos dos años, decidí hacer esta guía con la idea de poder ayudar a quienes **quieren entender** TestBed, o bien a quienes
se han encontrado con **algún problema que no hayan sabido afrentar**. Posiblemente haya otras muchas situaciones que no se lleguen a tratar
en este tutorial, pero al menos espero poder ofrecer unos conocimientos **básicos y necesarios**, y algo más profundos, que ayuden a solucionar
esas posibles complicaciones futuras.

#### Nota para el lector

> Esta "guía" (si se le puede llamar así) se ha hecho con la intención de ayudar al usuario a trabajar sobre **una aplicación ya hecha**. Para que le resulte más amena
> y fácil de seguir, se dividirán los conceptos en diferentes **tags versionadas** (que se notificarán en cada punto) para que pueda hacer ya los tests sobre **una** (o unas) **feature/s** existente/s.
> Para el primer caso, dado que será un tutorial más explicativo e introductorio, el test **ya vendrá hecho**, pero en las consecuentes versiones **no existirá el fichero de testing**. Sin embargo,
> **sí existirá una versión con los tests ya resueltos**, por si acaso el usuario así lo deseara.


### 1.1 Entonces, ¿por qué TestBed y no Spectator?


<div id='id1.1' />

TestBed tuvo una **gran actualización** durante la versión de **Angular 14** que no solo **mejoró** notablemente su legibilidad, sino que sigue la
**misma estela** de Spectator. El "problema" con Spectator es que su mantenimiento no está siendo regular, lo cual nos supone algunos riesgos. En el
momento en el cual se está escribiendo este tutorial, **Angular 16** ha incluido **Signals**, y se sabe que va a cambiar su compilador de **Webpack** por **ESBuild**.
TestBed está siendo **mantenido** por Angular, por lo que resulta menos probable que presente problemas ante las nuevas actualizaciones y drásticos cambios que
parecen avecinarse.

Además, veremos ahora que cuenta con **algunas ventajas** con respecto a Spectator que la hacen más atractiva :)

Dicho esto, ¡empecemos!

## 2. Pero antes, ¿qué es TestBed?

<hr>

<div id='id2' />


TestBed es una **librería** incluida dentro del framework de **Angular** que nos permite hacer
**tests de integración** con nuestros componentes. Eso significa que podremos comprobar que tanto la parte de la **UI**
como la parte de **funcionalidad** funcionan correctamente.

> Fuente oficial: https://angular.io/api/core/testing/TestBed


### 2.1 Entendiendo cómo funciona TestBed

<hr>


<div id='id2.1' />


**TestBed** nos permite **montar nuestro componente** tal cual es montado por el propio framework.
Es decir; pongamos por caso el ejemplo de la feature `header`. Esta feature está compuesta por
varios archivos:

1. La parte lógica: `header.component.ts`.
2. La template: `header.component.html`.
3. Los estilos o la hoja de estilos: `header.component.scss`.
4. El propio fichero de pruebas, `spec`: `header.component.spec.ts`

Si miramos dentro de nuestro fichero `header.component.spec.ts`, veremos una
instrucción que puede que nos llame la atención:

`````
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
`````

¿Qué significa esto?


## 3. Configurar el módulo del componente a testear

<hr>


<div id='id3' />

Los testing de **TestBed** se basan en **SCAM**:

**S**ingle
**C**omponent
**A**ngular
**M**odule

> Para saber más sobre SCAM:
> https://medium.com/marmicode/your-angular-module-is-a-scam-b4136ca3917b

> Nota importante: Aunque **TestBed** funcione como **SCAM**, **no significa** que tu aplicación tenga que estar construida siguiendo esta arquitectura.
> Tu componente (hablemos en este caso de ``HeaderComponent``) puede estar siendo **importado** dentro de un módulo **que no es** ``HeaderModule``, sino que a lo
> mejor es ``AppModule``. Esto significa que Angular **solo va a entender aquellos elementos que estén dentro de tu componente HeaderComponent**. Para él, ``HeaderComponent`` es
> una caja blanca.


> Fuente:
> https://www.testermoderno.com/caja-blanca-vs-caja-negra/

Eso quiere decir que Angular **imitará** la manera en la cual él trabaja
para hacer el testing del componente:

1. Necesitará de un **módulo** que importe el componente: ``TestBed.configureTestingModule``
2. E **importar** o **declarar** el **componente** a testear: ``imports: [ HeaderComponent ]``

El uso de **import** o **declarations** dependerá de **cómo hayamos construido** nuestro componente.
Echémosle un rápido vistazo a ``HeaderComponent``:

`````typescript

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {}
`````

Como vemos, el componente está declarado como ``standalone: true``. Si quitamos esta
instrucción y arrancamos el test de ``header.component.spec.ts``:

```typescript
Error: Unexpected directive 'HeaderComponent' imported by the module 'DynamicTestModule'. Please add an @NgModule annotation.
```

Veremos que nos sale un error como este. Eso es porque, al igual que ocurriría en el funcionamiento
normal de Angular, está detectando que **estamos intentando importar un componente que no es un módulo**. Para arreglarlo, tendríamos
dos vías: o **volver** a declarar el componente como ``standalone: true``, o cambiar la instrucción del test y poner ``declarations``:


````typescript
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ]
    })
    .compileComponents();
````

Todo dependerá de nuestro interés dentro del desarrollo de la aplicación. Aquí, volveremos a poner ``standalone:true`` al componente original.

Para concluir, vemos esta instrucción: ``.compileComponents()``. ¿Qué significa?
Como dijimos anteriormente, un componente está compuesto esencialmente por **template** + **lógica** + **hoja de estilos**. Esta instrucción lo que hace es
**terminar el montaje** del mismo, incluyendo los **tres ficheros** para que Angular pueda trabajar con él.

> Fuente:
> https://www.concretepage.com/angular/angular-testbed-compilecomponents

Por tanto, tenemos el primer paso definido: configurar el módulo del componente. Ahora, creemos el componente.


####  ¿Es necesario hacer el test asíncrono?


Bajo mi propia experiencia, **no**. Es cierto que Angular, en su **documentación oficial**, recomienda encapsularlo dentro de la instrucción ``beforeEach`` y hacerlo asíncrono,
pero en mi propia experiencia utilizando TestBed, esto no ha supuesto ningún problema ni a nivel de rendimiento ni a nivel de 
realización de testing, por lo que evitaremos utilizar esta encapsulación.

`````typescript
  TestBed.configureTestingModule({
      imports: [ HeaderComponent ]
    })
    .compileComponents();
`````

> Aquí te dejo más documentación al respecto:
> https://dev.to/this-is-angular/simplifying-angular-testbed-setup-by-converting-to-synchronous-test-hooks-19cl

Bien, continuemos con la **creación del componente**:

### 3.1 Creación del componente

<div id='id3.1' />


La instrucción que crea el componente es la siguiente: ``TestBed.createComponent(HeaderComponent)``
Esta instrucción tan solo nos **crea** la **instancia** del componente que vamos a testear. Este primer tutorial lo basaremos
en el componente de ``HeaderComponent``, por lo que ``TestBed.createComponent(HeaderComponent)`` nos permitirá obtener una **réplica** del componente
que queremos testear.

Si continuamos, vemos que lo almacena en una variable llamada ``fixture``:

```const fixture = TestBed.createComponent(HeaderComponent)```

> ¿Qué es **fixture**? Fixture no es más que un **concepto** que nos sirve para **agrupar** el **componente** y su **template**.
> Es recomendable utilizar esta nomenclatura nada más que por convención de los testing en TestBed.

Si ponemos el ratón encima de **fixture**, veremos lo siguiente:

![Captura de pantalla 2023-07-29 a las 14.28.57.png](src%2Fassets%2Fdocs%2FCaptura%20de%20pantalla%202023-07-29%20a%20las%2014.28.57.png)

**Fixture** es un objeto que nos permite obtener **dos cosas**:

1. El **control** del ciclo de vida de **nuestro componente a testear**.
2. La **propia instancia del componente**.

Antes decíamos que la instrucción ``createComponent`` nos devolvía una instancia del componente, y parece algo **que choca** con lo que estamos explicando ahora. Digamos
que ese **componente creado** está **partido en dos**: 

1. El **funcionamiento** (su ciclo de vida) del componente.
2. El **interior** del componente; es decir, **el componente en sí mismo**, donde veremos sus props, sus inputs, sus funciones... e, incluso **su template**.

> Fuente:
> https://www.concretepage.com/angular/angular-test-input-text#ComponentFixture


A estas alturas tenemos, por tanto, algo sobre lo que trabajar: un _wrapper_ de nuestro componente.
Para seguir con la estructura habitual de los testing, lo que haremos será agrupar las dos primeras funciones
que hemos visto que nos permiten crear el componente a testear en nuestra función ``setup``, y empecemos con lo siguiente.


### 3.2  Dos partes de una: fixture y component


<div id='id3.2' />


Como decíamos anteriormente, hemos simplificado un poco la manera en la que Angular nos inicializa los tests, y lo hemos agrupado
dentro de una estructura más comprensible para nosotros. Y ha quedad así:

````typescript
function sut() {

  TestBed.configureTestingModule({
    imports: [ HeaderComponent ]
  })

  const fixture = TestBed.createComponent(HeaderComponent);
  const component = fixture.componentInstance;

  return { fixture, component};
}

````

Ya hemos hablado de ``TestBed.createComponent`` y de qué significa ``fixture``. Solo para recordar, es un **wrapper**
entre nuestro componente y la template.

Si atendemos a la siguiente instrucción:

```const component = fixture.componentInstance;```

veremos que aquí se realiza la **primera parte** de lo que hablamos: recoger la **instancia interna** de nuestro componente.
A raíz de la nueva variable ``component``, podemos acceder a las propiedades de nuestro componente, espiar sus funciones, dispararlas, etc.

Por otro lado, seguimos manteniendo ``fixture``, pues será **lo que nos permita iniciar** el ciclo de vida de nuestro componente, y quien nos permita acceder a los elementos del DOM.

Una vez tenemos ya **montado** nuestro componente, procedamos a entender los primeros pasos de testing con TestBed.


## 4. Primeros pasos

<div id='id4' />


### 4.1 Iniciar el ciclo de vida del componente


<div id='id4.1' />

El **ciclo de vida** del componente, dentro del entorno de TestBed, se inicia **automáticamente** a la orden de ``createComponent``.
Sin embargo, para que **detecte** cualquier cambio realizado , necesitamos disparar **manualmente** la siguiente acción:

``fixture.detectChanges()``

Angular es un framework que funciona mediante su propia "metodología de trabajo": el **detectChanges**. Este mecanismo es el que le permite a
Angular **comprobar** que existen cambios en la template. Mediante los valores **pristine** y **dirty** (como en los **formularios**) **detecta** los
cambios que se han hecho a nivel de template y efectúa las acciones necesarias. Es por ello que se llama ``detectChanges``.

Sin embargo, **TestBed** trae un **mejorado** ``detectChanges``, llamado ``autoDetectChanges``. De momento **no lo usaremos**, pues me parece que **entender** cómo funciona
el ``detectChanges`` original es importante y aporta mucho, pero en el futuro veremos qué mejora.

Atendamos al primer test:

`````typescript
  it('should check title is correct', () => {
    const {component, fixture} = setup();

    fixture.detectChanges();

    expect(component.title).toEqual('Anote');
  });
`````

El test dice:

``Debería comprobarse que el título es correcto``.

Y vemos que el título esperado es ``'Anote'``

Como vemos, de nuestro ``sut`` sacamos **dos elementos**: 

1. ``fixture``
2. ``component``

Y vemos que, **lo primero** que hacemos, es lanzar ``fixture.detectChanges()``.

Tal y como está el test **ahora mismo**, la orden de ``fixture.detectChanges()`` no cambia nada. Podríamos hacer el test así:

`````typescript

  it('should check title is correct', () => {
    const {component} = sut();
    expect(component.title).toEqual('Anote');
  });
`````

Y pasaría correctamente. Esto es porque **no han habido cambios en el componente**. El componente ya se ha inicializado, 
la prop ``title`` ha sido creada y, por tanto, el test pasa adecuadamente. 

Este test, realmente, no se trata de un test de integración, sino de un **test unitario**.
Para que podamos hacer realmente un **test de integración**, deberíamos comprobar que el **elemento HTML** que debería **mostrar** el ``string`` asociado
a la prop ``title`` contiene **realmente** el texto esperado.


### 4.2 Convirtiendo nuestro test unitario en un test de integración

<div id='id4.2' />


Como dijimos anteriormente, el test anterior **solo** esta testeando la parte lógica e ignorando la template.
Nuestra template es muy sencilla:

`````html
<h1>{{ title }}</h1>
`````

Y como vemos, su idea es **pintar** (escribir, mejor dicho) lo que tengamos definido en la prop ``title`` del componente:

````typescript

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  title = 'Anote'

}
````

Es decir, **esperamos realmente ver que nuestro elemento ``<h1>`` contiene el texto `'Anote'`**.

El test debería ser realmente así:

``````typescript
  it('should check title is correct', () => {
    const { fixture} = sut();

    const title = fixture.nativeElement.querySelector('h1');

    expect(title.innerHTML).toEqual('Anote');
  });

``````

De esta manera, estamos **comprobando** dos cosas:

1. Que **existe** el elemento HTML que esperamos que esté en el header
2. (Indirectamente) que la prop ``title`` tiene correctamente definido el título esperado (`'Anote'`) y que éste es visible para el usuario.

Primero, veamos qué es la instrucción: ```fixture.nativeElement.querySelector('h1')```

Como dijimos anteriormente, ``fixture`` es un wrapper del componente. Cuando hacemos ``fixture.componentInstance``
tan solo estamos recogiendo la **parte lógica** del componente, el fichero ``.ts``. Para poder acceder a la template,
debemos utilizar la propiedad ``nativeElement`` (igual que cuando utilizamos ``viewRefContainer``), y seleccionar el elemento deseado
mediante la instrucción ``querySelector``.

> Nota: En muchos tutoriales se ve que se utiliza mucho ``debugElement``. Esto tiene una explicación, pero lo veremos en
> otro punto para no enredar mucho más este inicio.


Sin embargo, si corremos el test, veremos que **falla**. Y nos dice lo siguiente:

````
  Error: expect(received).toEqual(expected) // deep equality

  Expected: "Anote"
  Received: ""
````

Esto es porque, aunque **es cierto** que el ciclo de Angular se ha iniciado al hacer el ``createComponent``,
**sí que ha habido un cambio**, que es el **binding** de la prop ``title`` al elemento HTML ``h1``.
Los **binding** son recogidos por Angular como **efectos de cambio**, dado que **tiene que actualizar** el DOM para
pintar ese dato.

Tengamos en cuenta que Angular funciona más o menos así:

<img width="721" alt="Captura de pantalla 2023-07-29 a las 22 05 11" src="https://github.com/Bluubi/Anote/assets/125690321/7308e648-8bd9-479c-805f-60c8edbbfd63">

Por tanto, necesitamos **disparar** la detección de cambios para que Angular **capte** el binding.

``````typescript
  it('should check title is correct', () => {
    const { fixture} = sut();

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h1');

    expect(title.innerHTML).toContain('Anote');
  });
``````

> Nota: Hemos cambiado ``toEqual`` por ``toContain`` porque ignora los espaciados
> y para este test nos interesa no tener fallos por errores que no nos aporten mucho.

Y una vez realizados estos cambios, **el test funciona perfectamente**.

Entonces, recapitulando:

1. Para poder hacer testing de componentes, debemos **simular** la manera en la que Angular trabaja (**SCAM**).
Lo primero será **configurar el módulo** con el componente que queremos testear y los imports que necesite.

2. Lo siguiente que deberemos hacer será **crear el wrapper del componente** mediante ``createComponent`` y pasándole
el componente que queremos testear. A esta variable debemos llamarle ``fixture`` por convención.

3. Si queremos poder **detectar** los cambios en el componente, deberemos utilizar la orden ``fixture.detectChanges()`` para
ello. Solo así podremos comprobar los efectos del componente sobre la template.

4. Podemos rescatar elementos de la template gracias a ``fixture.nativeElement``, que nos permite acceder a ella, y seleccionar
cualquier elemento gracias a la instrucción ``querySelector``.

<hr>

## 5. Testing de dos o más componentes

<div id='id5' />

En el punto [4.2 Convirtiendo nuestro test unitario en un test de integración](#id4.2), hablamos de que si **tan solo** testeábamos la parte lógica
y nos desentendíamos de la parte de la template, realmente nuestro test era un **test unitario**. Una de las ventajas (o desventajas, depende de cómo lo veamos)
que nos provee Angular es **la posibilidad de testear un conjunto de componentes trabajando en armonía**.

Para la continuación de este tutorial, hemos creado una **nueva feature** muy simple, llamada ```PostComponent```. Si vemos en su interior, está compuesta por una única
prop llamada `post` que tiene un array de posts:

````typescript

 posts = [{
    title: 'Tarea pendiente',
    content: 'Crear el primer test de integración entre dos componentes de Angular'
  }]

````

> Nota: Podríamos tipar el objeto, es cierto, pero dado que estamos realizando una aplicación relativamente sencilla con el único propósito de aprender
> TestBed, evitaremos añadir más complejidad de la necesaria.

Y su template es muy sencilla:

````html
<ng-container *ngFor="let post of posts">
  <h1 class="title">{{ post.title}}</h1>
  <p class="content"> {{ post.content}} </p>
</ng-container>
````

Ahora, en la template de ``board.component.html``, vemos que se llama al selector ``<app-post>``, por lo que **pintará** el (o los) post/s que tengamos en nuestro
array de ``PostComponent``.

Empecemos por el primer componente: ``PostComponent``.

## 5.1 Replicando el comportamiento de nuestro componente a testear

<div id='id5.1' />


No me quiero repetir, pero recapitulemos una vez más lo que hace ``PostComponent``:

1. Tiene una prop declara llamada ``posts`` compuesta por un array de objetos.
2. En su template, pinta esta array de objetos

De momento, eso es todo. Lo que tenemos que asegurarnos es de dos cosas:

1. Que si existen **uno o más posts**, los pinte en la template.
2. Que si **no existe** ningún post, no pinte ninguno.

Esto va por gustos, pero cuando se me presenta un escenario donde **espero** varias posibles casuísticas, dependiendo de lo que
el **test de aceptación** (si es que hay) indique, desarrollo el test de una manera u otra. En este caso, **nosotros mismos** vamos a decidir
cuáles son nuestros **test de aceptación**, y serán los dos primeros puntos.

Bien, una vez sabido esto, empecemos por el principio.

## 5.2 Montando el componente ``PostComponent``

<div id='id5.2' />


Recordemos que **el primer paso** de todo test realizado con **TestBed** es **configurar** el módulo de nuestro
componente a testear:

````typescript
function sut() {
  TestBed.configureTestingModule({
    imports: [PostComponent]
  });
}
````

> Recuerda que, en la configuración del testing, utilizamos la instrucción ``imports`` por tratarse de un componente ``standalone``.
> Si no fuera así, deberíamos utilizar ``declarations``

¡Un momento! En nuestro componente, se está utilizando una **directiva** de Angular, concretamente la de **ngFor**. ¿Por qué **no es necesario** que la importemos en nuestro módulo de TestBed?
Esto es por **cómo funciona internamente Angular**. Dado que estamos importando el componente ``PostComponent``, éste está **importando de manera recursiva sus propias dependencias**. Es decir, nosotros **no estamos emulando** un componente, sino
**importándolo como tal**, con todas y cada una de sus **propias importaciones**. Así que ya ha sido nuestro ```PostComponent``` el encargado de importar el módulo necesario para que la directiva
**ngFor** funcione.

Bien, aclarado este punto, continuemos.

Creamos nuestra función ``sut``

> Nota! No tienes _por qué_ crear un **sut**. Esto es por convención, pero puedes configurar el testing module tal y como indica Angular (mira el punto [## 3. Configurar el módulo del componente a testear
](#id3) para más información si así lo prefieres).

Y creamos el componente a testear:

````typescript
  const fixture = TestBed.createComponent(PostComponent);
````
 
Ya tenemos nuestro wrapper hecho. Ahora, necesitamos coger la instancia del componente:

```typescript
  const component = fixture.componentInstance;
```

Y devolvemos todo. Nuestro ```sut``` queda así:

````typescript
function sut() {
  TestBed.configureTestingModule({
    imports: [PostComponent]
  });

  const fixture = TestBed.createComponent(PostComponent);
  const component = fixture.componentInstance;

  return { fixture, component }
}
````

Ahora pasemos a realizar el test y el primero paso: **Comprobar que lo que tenemos actualmente declarado en el componente se renderiza correctamente**.


### 5.2.1 Testeando el componente tal cual está

<div id='id5.2.1' />


Aquí es posible que te surja alguna duda, como, por ejemplo: **¿Y qué nombre le pongo al test?**

Hay un concepto que se utiliza mucho en términos de front, que se llama **render**. Con ese términos sabemos que **estamos asociando** una parte
**lógica** a una parte **visual**: estamos **esperando** que _algo_ declarado **por detrás** sea **mostrado visualmente**. Un posible nombre para el test
podría ser este:

````typescript
it('should render posts', () => { ... })
````

> Nota: Por supuesto eres libre de poner el nombre que creas que mejor se ajusta a la intencionalidad del test :)

Ahora pasemos al siguiente punto: **¿y cómo lo compruebo?**

Bien, ¿recuerdas que en el punto [### 4.2 Convirtiendo nuestro test unitario en un test de integración](#id4.2) hablamos de que existe un
**primer ciclo de vida** (por así decirlo) que se **dispara** en el momento en el que se **construye** el componente? (``TestBed.createComponent```).
Significa que, en el momento en que incluyamos la siguiente instrucción dentro de nuestro test:

`````typescript
it('should render posts', () => {
  const { fixture } = sut();
})
`````

El **ciclo de vida del componente iniciará**. Sin embargo, eso no significa que **la template** se haya montado. Recordemos que, para ello
precisamos de la siguiente instrucción:

``fixture.detectChanges()``

Ahora, pasemos al siguiente paso: **comprobar que, efectivamente, tenemos renderizado los posts**.


````typescript
  it('should render posts', () => {
    const { fixture } = sut();

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.title') as HTMLHeadElement;
    const content = fixture.nativeElement.querySelector('.content') as HTMLParagraphElement;

    expect(title.textContent).toContain('Tarea pendiente');
    expect(content.textContent).toContain('Crear el primer test de integración entre dos componentes de Angular');
  })
````

Recuerda, los pasos que debemos seguir son:

1. Montar el módulo del componente a testear (ya lo hemos montado anteriormente).
2. Montar el propio componente (también hecho anteriormente).
3. Disparar el **ciclo de vida** de los componentes de Angular para que **detecte** los bindings de la template.

Y una vez hemos hecho eso, podemos hacer los siguientes pasos:

- Coger los elementos sobre los que queremos comprobar algo:

```typescript
const title = fixture.nativeElement.querySelector('.title') as HTMLHeadElement;
const content = fixture.nativeElement.querySelector('.content') as HTMLParagraphElement;
```

- Comprobar que **el texto** coincide con lo que esperamos (que es lo definido por el componente):

```typescript
    expect(title.textContent).toContain('Tarea pendiente');
    expect(content.textContent).toContain('Crear el primer test de integración entre dos componentes de Angular');
```

> Fuente oficial: https://angular.io/guide/testing-components-scenarios

El test **pasa** correctamente. Pero, ¿y si tenemos más de un objeto en nuestro array de posts? ¿Podemos _simular_ ese 
escenario? La respuesta es **sí**.

### 5.2.2 Probando escenarios: sobreescribir propiedades internas.

<div id='id5.2.2' />


Hay algo que es importante de aclarar en este punto: estamos **sobreescribiendo una propiedad interna** del componente. No 
es recibida mediante input ni modificada mediante **ningún otro hecho**. Cuando se den esos escenarios, analizaremos **cómo** hay
que hacerlo de la manera correcta, pero en este caso, que tenemos un post hecho **a pelo** y que, simplemente, queremos comprobar que
se generen el número de posts de acuerdo a lo que haya en nuestro array, nos servirá hacerlo de esta manera.

Para poder modificar esta prop, solamente necesitamos **rescatar** el objeto **component** que **no hicimos** en el primer test:

`````typescript
    const { fixture, component } = sut();
`````

> Recordatorio: ```fixture``` es el wrapper del componente, pero ```component``` es el **componente en sí mismo**, el que tiene acceso a sus props, métodos, etc.

Entonces, si utilizamos ```component```... :

````
    component.posts
````

Veremos que **podemos acceder a la prop**. Ahora podemos modificarla con, por ejemplo, esto:

````typescript
    component.posts = [{
      title: 'Awesome title',
      content: 'Awesome content'
    }, 
      {
        title: 'Another awesome title',
      content: 'Another awesome content'
      }];
````

Si lanzamos el test, veremos que **falla**, lo cual es bueno, porque significa que ha cogido los cambios:

````typescript
Expected substring: "Tarea pendiente"
Received string:    "Awesome title"
````

Ahora solo tenemos que ajustar lo deseado por el test. Primero de todo, el título:

`` should render all posts ``

Ahora, vamos a probar que se hayan renderizado **el número correcto de elementos**. Lo primero es cambiar tanto el **tipo de selector** que debemos utilizar como el tipado de lo que estamos recogiendo.
**A fin de cuentas, son un array de elementos**

````typescript
    const title = fixture.nativeElement.querySelectorAll('.title') as HTMLHeadElement[];
    const content = fixture.nativeElement.querySelectorAll('.content') as HTMLParagraphElement[];
````

> Nota: fíjate que hemos sustituido ``querySelector`` por ``querySelectorAll``

Ahora, podemos comprobar que **el número de elementos renderizados concuerda con el número de posts**:

````typescript
    expect(title.length).toBe(2)
    expect(content.length).toBe(2)
````

Y, a continuación, que el contenido de cada uno de ellos es correcto:

`````typescript

     expect(title[0].textContent).toContain('Awesome title');
     expect(title[1].textContent).toContain('Another awesome title');
     expect(content[0].textContent).toContain('Awesome content');
     expect(content[1].textContent).toContain('Another awesome content');
     
`````

El test, al completo, quedaría así:


````typescript

  it('should render all posts', () => {
    const { fixture, component } = sut();

    component.posts = [{
      title: 'Awesome title',
      content: 'Awesome content'
    },
      {
        title: 'Another awesome title',
      content: 'Another awesome content'
      }];


    fixture.detectChanges();

    const title = fixture.nativeElement.querySelectorAll('.title') as HTMLHeadElement[];
    const content = fixture.nativeElement.querySelectorAll('.content') as HTMLParagraphElement[];

    expect(title.length).toBe(2)
    expect(content.length).toBe(2)
    
     expect(title[0].textContent).toContain('Awesome title');
     expect(title[1].textContent).toContain('Another awesome title');
     expect(content[0].textContent).toContain('Awesome content');
     expect(content[1].textContent).toContain('Another awesome content');
  })
````

Entonces, en este nuevo punto hemos podido comprobar **cómo hacer un test de integración** al completo.

> Nota: Estos tests **distan mucho** de la manera en la que **realmente** terminaremos testeando nuestros componentes, pero son perfectos
> para que vayamos familiarizándonos con las herramientas de TestBed, y entendiendo su manera de funcionar.


## 5.3 Test de props como inputs

<div id='id5.3' />

Hemos testeado el componente de ``PostComponent`` asumiendo que las ``props`` las tenía cargadas él mismo. Pero, ¿y si vienen desde fuera?
Entonces la manera de hacer el testing cambia. Y, además, **cambia bastante**. ¡Atención!

## 5.4 Un nuevo enfoque: Testeando con un HostComponent

<div id='id5.4' />


Si repasamos el testing de ```PostComponent```, vemos que el ``createComponent`` se realizó sobre ``PostComponent``:

````typescript
const fixture = TestBed.createComponent(PostComponent);
````

Presta atención, porque **será esto lo que cambiará**.

Tenemos que tener en cuenta que la estructura de nuestro componente ``PostComponent`` ha cambiado:

````typescript
@Component({selector: 'app-post'})
export class PostComponent {

  @Input() posts!: Posts[];

}
````

Las propiedades **ya no están definidas desde el propio componente**, sino que **nos llegarán desde fuera**. Eso significa
que nuestra manera de enfocar el test **también tiene que cambiar**: ya no crearemos el test sobre ``PostComponent``, sino sobre un ``HostComponent`` que **replicará**
el **padre** del componente a testear.

`````typescript
  const fixture = TestBed.createComponent(HostComponent);
`````

Menudo lío, ¿verdad?. Veamos si somos capaces de ir poco a poco para entenderlo.

### 5.4.1 Cambiando el punto de vista: Viéndolo _desde_ el padre.

<div id='id5.4.1' />

Veámoslo por un momento según funciona Angular. Tenemos el un componente que es el padre:

````typescript
@Component({selector: 'app-host', template: `<app-child [value]='foo'></app-child>`})
export class HostComponent {
}
````

El componente padre está invocando a un componente hijo: ``ChildComponent``

````typescript
@Component({selector: 'app-child', template: `<p>{{value}}</p>`})
export class ChildComponent {
    @Input() value: any
}
````

Como vemos, el hijo _espera_ recibir por ``input`` un valor, el que sea. Si lo viéramos en acción, lo que veríamos en
nuestro ``DOM`` sería:

`````
 <app-host ng-reflect-value="[object Object]">
      <p> Foo </h1>
 </app-host>

`````

Es decir, que **es el padre quien está renderizando al hijo**. Por ello, el componente que tenemos que **crear** es **un padre**; porque nos servirá de **puente** para comprobar
que nuestro verdadero interés (el componente hijo) recibe correctamente sus valores.

Aquí tenemos dos opciones: 

1. Crearnos un ``HostComponent`` ficticio que cumpla con las condiciones que necesitamos. Es decir:


````typescript
@Component({
  template: `<app-post [posts]="posts"> </app-post>`,
  standalone: true,
  imports: [PostComponent]
})
class HostComponent {
  posts = [{
    title: 'Tarea pendiente',
    content: 'Crear el primer test de integración entre dos componentes de Angular'
  }]
}

````
A nivel del test, nos creamos un componente padre que sea casi una **réplica** del componente original (en este caso, una réplica de ``BoardComponent`)

Y configuramos el test **desde el padre**:

````typescript
function sut() {
  TestBed.configureTestingModule({
    imports: [HostComponent, PostComponent]
  });

  const fixture = TestBed.createComponent(HostComponent);

  const component = fixture.componentInstance;

  return { fixture, component }
}
````

> ¡Atención! ¿Te has fijado en que **hemos importado los dos componentes**, tanto el padre como el hijo? **Recordemos**; estamos **replicando** cómo funciona
> Angular, y estamos **creando** un módulo. Si ese módulo no tiene conocimiento del componente que quiere utilizar, **se quejará** (y con razón) de no conocerle.


2. Dependiendo de la **complejidad** del padre, utilizar **el padre original** para realizar el test:

`````typescript
function sut() {
  TestBed.configureTestingModule({
    imports: [BoardComponent, PostComponent]
  });

  const fixture = TestBed.createComponent(BoardComponent);

  const component = fixture.componentInstance;

  return { fixture, component }
}
`````
Como en este caso nuestro **padre** es muy sencillo, le utilizaremos a él. Y, si te fijas, **el resto del test no ha cambiado**. No hemos tenido que modificar
el test ni su manera de funcionar. En todo caso, dado que hemos cambiado el contenido de los posts:

```typescript
posts = [{
    title: 'Tarea pendiente',
    content: 'Crear el primer test de integración entre dos componentes de Angular'
  }]
```

Solo necesitaremos actualizar los mensajes esperados:

```typescript
    expect(title.textContent).toContain('Tarea pendiente');
    expect(content.textContent).toContain('Crear el primer test de integración entre dos componentes de Angular');

```



## 6. Testing de rutas: RouterTestingHarness

<div id='id6' />

> ¡Atención! Si te fijas, los tests de ``PostComponent`` han cambiado un poco porque se han añadido
> dos posts al array. Se ha reescrito el primero, y añadido uno nuevo.


  ## 6.1 Algunos cambios

<div id='id6.1' />


- En esta sección hemos creado un componente nuevo, al que hemos llamado ```FormComponent```, y que se encuentra dentro
  de ``src/app/features/post/features/form``. También se ha creado una nueva ruta:

```typescript
export const ROUTES: Paths = {
    ...
  POST: { path: 'post', children: [
      { path: ':id', component: FormComponent }]
  }
}
```

- Se ha redistribuido el contenido HTML de los componentes ``BoardComponent`` y ``PostComponent``

- Desde el componente ```BoardComponent``` se ha añadido una nueva funcionalidad para acceder a cada
- post de manera concreta: ```render```

  ## 6.2 ¿Qué es RouterTestingHarness?

  <div id='id6.2' />

  ``RoutingTestingHarness`` es una **nueva clase** que ha añadido **Angular** a partir de la versión ``15.2``, y que supone
un reemplazo a la manera que ha tenido desde siempre Angular de hacer testing del Router de sus componentes.

> Fuentes: https://dev.to/this-is-angular/testing-angular-routing-components-with-routertestingharness-providelocationmocks-and-providerouter-oi8#:~:text=RouterTestingHarness%20(introduced%20by%20Angular%20version%2015.2)%20is%20a%20testing%20harness,the%20standalone%20version%20of%20RouterModule.
> 
> Youtube: https://youtu.be/RG5iN783rAY?t=430
> 
> Documentación oficial: https://angular.io/api/router/testing/RouterTestingHarness

  Con ```RouterTestingHarness``` seremos capaces de comprobar, **sin necesidad de mockear el router de nuestra aplicación**, si las rutas funcionan
  correctamente.
  
## 6.3 Configuración del Router

  <div id='id6.3' />


  Es muy sencillo. En la propia documentación de Angular se nos explica el proceso para hacerlo.

  Lo único que tenemos que hacer es utilizar la instrucción ``await RouterTestingHarness.create();`` para crear una **instancia** de esta clase.


<img width="559" alt="Captura de pantalla 2023-08-12 a las 15 01 28" src="https://github.com/Bluubi/Anote/assets/125690321/9000d80a-79c2-459c-9354-48687aabf62e">


## 6.4 Objetivo del test

  <div id='id6.4' />

  Lo que pretendemos comprobar es que, cuando el usuario haga click en un post concreto:

  1. Se actualice la ruta correctamente
  2. Lleve al post del que se ha hecho ```click```.

  Con la ayuda de ```RouterTestingHarness``` será muy sencillo.
  

## 6.5 Preparación del escenario

  <div id='id6.5' />

  Lo primero que tenemos que plantearnos es **quién debe tener el testing**. Todo depende de cómo hayamos planteado nuestra feature, pero en nuestro caso, funciona así:
  
<img width="555" alt="Captura de pantalla 2023-08-12 a las 16 13 44" src="https://github.com/Bluubi/Anote/assets/125690321/a84d904f-ba7d-4d7e-8565-0d1fce2e785f">

  En ```BoardComponent``` se renderizan una lista de posts, que pertenecen a ``PostComponent``. Y es en **ese punto** donde se produce la interacción entre **el click del usuario** y
  la **navegación al post**. El usuario hace **click** en un post, que dispara una función **situada** en ```BoardComponent``` y que éste, a su vez, dispara una función ubicada en ``PostComponent``, que es quien ejecuta
  la navegación.

  Por tanto, lo que nos interesa es ver que, efectivamente, **desde el post renderizado en** ```BoardComponent``` podemos **acceder** a la ruta correcta; no solo eso, sino que **se renderice en pantalla** lo que estamos esperando.
  Para este escenario tan solo esperamos la navegación y la carga del componente. El contenido de ```FormComponent``` relativo al path ``post/:id`` es muy simple.

  Una vez sabemos esto, acudimos a nuestro fichero `spec` de ``BoardComponent`` y configuramos el módulo para el testing:

`````typescript
  await TestBed.configureTestingModule({
    imports: [AppRoutingModule, PostComponent, FormComponent],
  }).compileComponents();
`````

  Dentro de los imports tenemos ```AppRoutingModule```. Eso es porque la configuración del ``router`` de nuestra
aplicación se encuentra en este módulo:

````
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
````

  Y necesitamos los otros dos componentes, ``PostComponent`` y ``FormComponent``, porque de lo contrario:
  1. No se generarían los posts (dado que se generan gracias a ``PostComponent``) ni podríamos utilizar el método ``render`` de allí.
  2. No podríamos navegar hasta ``FormComponent`` porque no sería un componente reconocido.

Una vez tenemos nuestro router de testing montado, podemos continuar montando el del router:

```  typescript
const router = await RouterTestingHarness.create();
```

Y, de momento, actuar como siempre: devolvemos el ``fixture``, el ``sut`` y el ``router`` creados.

```typescript
return { fixture, sut, router }
```

> ¡Atención! En este test vamos a utilizar una de las mejoras que presenta ``TestBed``: `autoDetectChanges`.
> `autoDetectChanges` es una instrucción que permite a TestBed detectar **automáticamente** cualquier cambio que haya disparado el ``detectChanges`` suyo. Con esta instrucción: ``fixture.autoDetectChanges(true);`` no tendremos que volver a preocuparnos de indicar que detecte los cambios.

## 6.6 Ejecución

  <div id='id6.6' />

  Como hemos indicado arriba:

1. El usuario hace click en un post

2. Se activa la función ``render`` de ``BoardComponent``

3. Desde ``render`` se llama a la otra función ``render`` de ``PostComponent``

4. Desde ```PostComponent``` se navega a la ruta ``path/:id`` y al componente ``FormComponent``


El **punto 1** sería:

`````typescript

  it('should navigate to concrete post when user click on it', async () => {
  const { fixture, router } = await setup();

  const post = fixture.nativeElement.querySelector('app-post') as HTMLElement;

  const click = new MouseEvent('click');

  post.dispatchEvent(click);
  
})
`````

  Lo primero es que tenemos que escoger un ``post`` de los renderizados. Podemos coger el primero mismo, y por ello un simple ``querySelector``
nos sirve. Lo segundo, es que tenemos que **crear** el evento disparador: el **click** del ratón, y hacer que nuestro ``post`` lo lance.

> Puede crearse **cualquier evento** disparado por el usuario:
> https://developer.mozilla.org/en-US/docs/Web/API/UI_Events
> 
> Y "fingir" una acción del usuario mediante ``dispatchEvent(event)``
> 
> https://developer.mozilla.org/es/docs/Web/API/EventTarget/dispatchEvent

Hecho esto debería, por lo menos, llamar la función ```render``` de ``BoardComponent``. Podemos comprobarlo espiando el evento:

````
  it('should navigate to concrete post when user click on it', async () => {
    const { fixture, sut, router } = await setup();

    const post = fixture.nativeElement.querySelector('app-post') as HTMLElement;

    ---> const renderSpy = jest.spyOn(sut, 'render');

    const click = new MouseEvent('click');

    post.dispatchEvent(click);

    ----> expect(renderSpy).toHaveBeenCalledWith(0)
  })

````

Espiando la función, podemos comprobar que, efectivamente, es llamada (y con el parámetro correcto). Sin embargo, no necesitamos
hacer esto, pues al estar probando toda la funcionalidad, indirectamente **ya estamos comprobando** que la función es llamada. Este dato
se ha nombrado únicamente para poder ir viendo **cómo** vamos bien encaminados.

Continuando con el test, ahora será cuando debamos de hacer uso de nuestra instancia de ``RouterTestingHarness``. Desde esta instancia
podremos acceder a dos propiedades:

1. ``fixture``
2. ``routeNativeElement``

Al igual que ocurre cuando creamos una instancia mediante ``TestBed.configureRoutingModule``, obtenemos
una especie de **wrapper** del HTML (el ```<router-outlet>``` al que se ha redirigido) y los métodos del router
(como ``navigateByUrl``, por ejemplo).

En cuento a ``routerNativeElement``:

>> The resolved RouterTestingHarness instance has the properties routeDebugElement 
>> and routeNativeElement which access the DebugElement and HTMLElement corresponding 
>> to the component currently activated by the test root component's RouterOutlet.

Es decir, que mediante ``routerNativeElement`` podremos **acceder** al `router-outlet` activado por la
navegación, devolviéndonoslo en un elemento HTML.

Si imprimimos la siguiente instrucción:

```typescript
    console.log(router.routeNativeElement?.outerHTML);
```

tras haber hecho:

```typescript
     post.dispatchEvent(click);
```

veremos la siguiente impresión:

````typescript

    <app-form>
    <p>form works!</p><router-outlet name="form" ng-reflect-name="form">
    </router-outlet><!--container-->
    </app-form>

````

Es decir, tenemos la **confirmación** de que no solo ha podido navegar correcta, sino de que se
ha cargado el componente **correcto**. Incluso podemos confirmar que **lo que se vea** concuerda
con lo que esperamos.

Pero, sin embargo, si intentamos recoger el elemento HTML mediante un ``querySelector``...

```  console.log(router.routeNativeElement?.querySelector('app-form')) ```

Veremos que nos devuelve un ``null``. Por lo tanto, ``routeNativeElement`` no nos sirve para testing,
así que utilizaremos el **wrapper**, al igual que en el caso de ``TestBed.configureTestingModule``:

``` router.fixture ```

Así que creamos el objeto de estudio:

```typescript
  const router = routerFixture.fixture as ComponentFixture<unknown>;

```

> ¡Atención! Lo creamos como ``unknown`` porque, posiblemente, vaya más acorde a la documentación oficial:
> <img width="460" alt="Captura de pantalla 2023-08-12 a las 22 43 51" src="https://github.com/Bluubi/Anote/assets/125690321/20fcd68a-bd6d-4a1f-a077-2d2a4e15ab8d">

Nuestro ``setup`` queda así:

`````typescript
async function setup() {

  await TestBed.configureTestingModule({
    imports: [AppRoutingModule, PostComponent, FormComponent],
  }).compileComponents();

  const routerFixture = await RouterTestingHarness.create();

  const router = routerFixture.fixture as ComponentFixture<unknown>;
  const fixture = TestBed.createComponent(BoardComponent);
  const sut = fixture.componentInstance;

  fixture.autoDetectChanges(true);

  return { fixture, sut, router }
}

`````

Y nuestro test continúa de la siguiente manera:

````typescript
  it('should navigate to concrete post when user click on it', async () => {
    const { fixture, router } = await setup();

    const post = fixture.nativeElement.querySelector('app-post') as HTMLElement;

    const click = new MouseEvent('click');

    post.dispatchEvent(click);

    const form = router.nativeElement.querySelector('app-form');

    expect(form).toBeDefined();
  })
````

### 6.6.1 Extra: comprobación de la url

  <div id='id6.6.1' />

  Para terminar de asegurarnos de que la navegación ha sido exitosa, podemos complementarlo comprobando que la URl sea la esperada.

  Si repasamos el método ``render``:

```typescript

    BoardComponent

  render(id: number){
    this.post.render(id);
  }
```

  Vemos que se envía el ``id`` asociado al post. 
  Y luego en ```PostComponent```:

```typescript

    PostComponent

    render(id: number){
      this.router.navigate(['post', id] );
    }
```

vemos que se navega hacia el post, y se le pasa por ``queryParam`` el ``id`` del mismo.

Para comprobar que la url es la esperada, podemos utilizar la siguiente instrucción:

``const routerDI = TestBed.inject(Router);``


> ¡Atención! Si miras en tutoriales de internet, verás que la mayoría utilizan ``Location`` para comprobar
> la localización:
>  ```typescript
>   const location = TestBed.inject(Location);
>  ```
>  Pero si utilizamos ese servicio, nos dará fallo por ```NullInjection```.
> Al contrario que con la inyección del ``Router``, dado que ya tenemos su inyección
> hecha en ```AppRoutingModule```, no nos dará fallo.

Y, a continuación, utilizar:

```typescript
    expect(routerDI.url).toEqual('/post/0')
```

El test queda así completo:

````typescript
  it('should navigate to concrete post when user click on it', async () => {
  const { fixture, router } = await setup();

  const post = fixture.nativeElement.querySelector('app-post') as HTMLElement;

  const routerDI = TestBed.inject(Router);


  const click = new MouseEvent('click');
  post.dispatchEvent(click);

  const form = router.nativeElement.querySelector('app-form');

  expect(form).toBeDefined();
  expect(routerDI.url).toEqual('/post/0')
})
````
