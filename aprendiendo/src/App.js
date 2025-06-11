import { useState, useEffect } from 'react';
import './App.css';
import Axios from "axios"
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  // Use
  const [id_usuario, setId_usuario] = useState(0);
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [id_tipo, setId_tipo] = useState("");
  const [usuariosList, setUsuarios] = useState([]);
  const [editar, setEditar] = useState(false);

  // Inicializar id_tipo con "3" al montar el componente
  useEffect(() => {
    setId_tipo("3");
  }, []);

  // Función para limpiar el formulario
  const clear = () => {
    setId_usuario(0);
    setUsuario("");
    setNombre("");
    setApellido("");
    setCorreo("");
    setPassword("");
    setId_tipo("3");
    setEditar(false);
  };

  // Función crear usuario
  const add = () => {
    Axios.post("http://localhost:3001/create", {
      id_usuario,
      usuario,
      nombre,
      apellido,
      correo,
      password,
      id_tipo,
    }).then(() => {
      listar();
      clear();
      Swal.fire({
        title: "<strong>REGISTRO EXITOSO!!!</strong>",
        html: `<i> El usuario <strong>${nombre}</strong> fue registrado con éxito!! </i>`,
        icon: 'success',
        timer: 3000
      });
    }).catch(function (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ooops...',
        text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más Tarde" : JSON.parse(JSON.stringify(error)).message
      });
    });
  };

  // Leer usuarios
  const listar = () => {
    Axios.get("http://localhost:3001/usuarios").then((response) => {
      setUsuarios(response.data);
    });
  };

  // Actualizar usuario
  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id_usuario,
      usuario,
      nombre,
      apellido,
      correo,
      password,
      id_tipo,
    }).then(() => {
      listar();
      clear();
      Swal.fire({
        title: "<strong>ACTUALIZACION EXITOSA!!!</strong>",
        html: `<i> El usuario <strong>${nombre}</strong> fue actualizado con éxito!! </i>`,
        icon: 'success',
        timer: 3000
      });
    }).catch(function (error) {
      Swal.fire({
        icon: 'error',
        title: 'Ooops...',
        text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente más Tarde" : JSON.parse(JSON.stringify(error)).message
      });
    });
  };

  // Editar usuario - cargar datos en formulario
  const editarUsuario = (val) => {
    setEditar(true);
    setId_usuario(val.id_usuario);
    setUsuario(val.usuario);
    setNombre(val.nombre);
    setApellido(val.apellido);
    setCorreo(val.correo);
    setPassword(val.password);
    setId_tipo(val.id_tipo);
  };

  // Eliminar usuario
  const deleteUsu = (val) => {
    Swal.fire({
      title: '¿Confirmar Eliminado?',
      html: `<i> Realmente desea eliminar <strong>${val.nombre}</strong></i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'SI, ELIMINAR'
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id_usuario}`).then(() => {
          listar();
          clear();
          Swal.fire({
            icon: 'success',
            title: `${val.nombre} ELIMINADO EXITOSAMENTE`,
            showConfirmButton: false,
            timer: 2000
          });
        }).catch(function (error) {
          Swal.fire({
            icon: 'error',
            title: 'Ooops...',
            text: 'No se logró eliminar',
            footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente en otro momento" : JSON.parse(JSON.stringify(error)).message
          });
        });
      }
    });
  };

  return (
    <div className="container">

      <div className='card text-center'>

        <div className='card-header'>
          GESTION DE USUARIOS
        </div>

        <div className='card-body'>

          <div className='formulario'>

            <h3>Datos de Usuario</h3>

            <div className='info'>
              <label>Nombre de Usuario</label>
              <input type='text' onChange={(event) => { setUsuario(event.target.value); }} className='form-control' value={usuario} />
            </div>

            <div className='info'>
              <label>Nombre</label>
              <input type='text' onChange={(event) => { setNombre(event.target.value); }} className='form-control' value={nombre} />
            </div>

            <div className='info'>
              <label>Apellidos</label>
              <input type='text' onChange={(event) => { setApellido(event.target.value); }} className='form-control' value={apellido} />
            </div>

            <div className='info'>
              <label>Email</label>
              <input type='email' onChange={(event) => { setCorreo(event.target.value); }} className='form-control' value={correo} />
            </div>

            <div className='info'>
              <label>No.Documento</label>
              <input type='number' onChange={(event) => { setId_usuario(event.target.value); }} className='form-control' value={id_usuario} />
            </div>

            <div className='info'>
              <label>Password</label>
              <input type='text' onChange={(event) => { setPassword(event.target.value); }} className='form-control' value={password} />
            </div>

            <div className='info'>
              <label>Tipo de Usuario</label>
              <input disabled type='text' className='form-control' value={id_tipo} />
            </div>

          </div>
          <div className='card-footer text-muted'>
            {
              editar ?
                <div>
                  <button className='btn btn-warning m-2' onClick={update}>Actualizar</button>
                  <button className='btn btn-info m-2' onClick={clear}>Cancelar</button>
                  <button className='btn btn-danger m-2' onClick={() => deleteUsu({ id_usuario, nombre })}>Eliminar</button>
                </div>
                : <button className='btn btn-success' onClick={add}>Registrar</button>
            }
            <button className='btn btn-secondary' onClick={listar}>Lista</button>
          </div>
        </div>
      </div>

      <div className='lista'>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th scope='col'>Documento</th>
              <th scope='col'>Usuario</th>
              <th scope='col'>Nombre</th>
              <th scope='col'>Apellidos</th>
              <th scope='col'>Email</th>
              <th scope='col'>Password</th>
              <th scope='col'>Tipo de Usuario</th>
              <th scope='col'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              usuariosList.map((val) => {
                return <tr key={val.id_usuario}>
                  <th>{val.id_usuario}</th>
                  <td>{val.usuario}</td>
                  <td>{val.nombre}</td>
                  <td>{val.apellido}</td>
                  <td>{val.correo}</td>
                  <td>{val.password}</td>
                  <td>{val.id_tipo}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button" onClick={() => { editarUsuario(val); }} className="btn btn-warning">Actualizar</button>
                      <button type="button" onClick={() => { deleteUsu(val); }} className="btn btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
