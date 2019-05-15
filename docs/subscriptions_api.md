# Subscribing React components to changes in store's state

You need to use the following function:

## `subscribe`
This function subscribes a React component to given [reselect](https://github.com/reduxjs/reselect)’s selectors, so that it only renders when the values in the application state tracked by the given selectors change.

The `subscribe` function receives one parameter, called `mapStateToProps`, which is a function that maps the application state to the properties of the component we want to subscribe.

The `subscribe` function returns a reactive wrapper component that we'll use to make any component that it wraps, render only when the values mapped by `mapStateToProps` function change. 

We always use  [reselect](https://github.com/reduxjs/reselect)’s selectors to write the `mapStateToProps` function because they give us memoization, composability and tools for testing out of the box. This allows to avoid writing code to optimize rerenderings.

Example:
```js
import React from "react";
import { dispatch } from "reffects";
import { subscribe } from "reffects-store";
import { visibleTodosSelector } from "../selectors";
import TodoItem from "./TodoItem";
import { VISIBILITY_FILTERS_SHOW_ALL, VISIBILITY_FILTERS_SHOW_DONE, VISIBILITY_FILTERS_SHOW_UNDONE } from "../constants";

export function TodoList({ todos, handleFilterClick }) {
  return (
    <React.Fragment>
       <ul>
         {todos.map(todo => (
            <li key={todo.id}>
                <TodoItem text={todo.text} isDone={todo.done} />
            </li>
         ))}
       </ul>
       <section>
         <button onClick={() => handleFilterClick(VISIBILITY_FILTERS_SHOW_DONE)}>Done</button>
         <button onClick={() => handleFilterClick(VISIBILITY_FILTERS_SHOW_UNDONE)}>Undone</button>
       </section>
     </React.Fragment>
  );
}

const mapStateToProps = function (state) {
  return {
    todos: visibleTodosSelector(state),
    handleFilterClick: activeFilter => {
      dispatch({ eventId: 'filterTodos', payload: activeFilter });
    }
  };
}

const ReactiveWrapper = subscribe(mapStateToProps);

export default ReactiveWrapper(TodoList);
```

In this example calling `subscribe` will return a component subscribed to changes in the store that will render only when the value produced by the `visibleTodosSelector` selector changes. Then we use this component, that we called `ReactiveWrapper`, to wrap the `TodoList` component, so that, it also rendersonly when the value produced by the `visibleTodosSelector` selector changes.

We have written this example more verbosely than usual in order to explicitly show the existence of a the reactive wrapper.

The following example shows how we'd usually call `subscribe`:

```js
import React from "react";
import { dispatch } from "reffects";
import { subscribe } from "reffects-store";
import { visibleTodosSelector } from "../selectors";
import TodoItem from "./TodoItem";
import { VISIBILITY_FILTERS_SHOW_ALL, VISIBILITY_FILTERS_SHOW_DONE, VISIBILITY_FILTERS_SHOW_UNDONE } from "../constants";

export function TodoList({ todos, handleFilterClick }) {
  return (
    <React.Fragment>
       <ul>
         {todos.map(todo => (
            <li key={todo.id}>
                <TodoItem text={todo.text} isDone={todo.done} />
            </li>
         ))}
       </ul>
       <section>
         <button onClick={() => handleFilterClick(VISIBILITY_FILTERS_SHOW_DONE)}>Done</button>
         <button onClick={() => handleFilterClick(VISIBILITY_FILTERS_SHOW_UNDONE)}>Undone</button>
       </section>
     </React.Fragment>
  );
}

export default subscribe(function (state) {
  return {
    todos: visibleTodosSelector(state),
    handleFilterClick: activeFilter => {
      dispatch({ eventId: 'filterTodos', payload: activeFilter });
    }
  };
})(TodoList);
```


