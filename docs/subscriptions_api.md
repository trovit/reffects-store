## `subscribe`
This function subscribes a React component to given [reselect](https://github.com/reduxjs/reselect)’s selectors, so that ity only renders when the values in the application state tracked by the given selectors change.

Example:
```js
export function TodoList({ todos, handleFilterClick }) {
  return (
    <React.Fragment>
      <ul>
        {todos ? (
          todos.map(function (todo) {
            return (
              <li key={todo.id} className={`${todo.done ? 'done' : 'undone'}`}>
                <TodoItem id={todo.id} text={todo.text} isDone={todo.done} />
              </li>
            );
          })
        ) : (
            <p> No todos </p>
          )}
      </ul>
      <section>
        <button onClick={() => handleFilterClick(VISIBILITY_FILTERS_SHOW_ALL)}>All</button>
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
    },
  };
})(TodoList);
```

The call to `subscribe` will return make the `TodoList` component render only when the value produced by the `visibleTodosSelector` selector changes.
