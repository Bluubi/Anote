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

## 1. Introducción

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

<div id='id2' />


TestBed es una **librería** incluida dentro del framework de **Angular** que nos permite hacer
**tests de integración** con nuestros componentes. Eso significa que podremos comprobar que tanto la parte de la **UI**
como la parte de **funcionalidad** funcionan correctamente.

> Fuente oficial: https://angular.io/api/core/testing/TestBed


### 2.1 Entendiendo cómo funciona TestBed


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


<div id='id3' />

Los testing de **TestBed** se basan en **SCAM**:

**S**ingle
**C**omponent
**A**ngular
**M**odule

> Para saber más sobre SCAM:
> https://medium.com/marmicode/your-angular-module-is-a-scam-b4136ca3917b

![Captura de pantalla 2023-07-29 a las 14.41.26.png](..%2F..%2F..%2FDesktop%2FCaptura%20de%20pantalla%202023-07-29%20a%20las%2014.41.26.png)

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


#### 3.0.1 ¿Es necesario hacer el test asíncrono?


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

![Captura de pantalla 2023-07-29 a las 22.05.11.png](..%2F..%2F..%2FDesktop%2FCaptura%20de%20pantalla%202023-07-29%20a%20las%2022.05.11.png)

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

