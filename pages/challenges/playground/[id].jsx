import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import Header from '../../../components/security/header/Header';
import styled from '@emotion/styled';
import Coolicon from '../../../public/icons/coolicon.svg';
import Image from 'next/image';
import iconSuccess from '../../../public/icons/successChallengeTest.png';
import iconFail from '../../../public/icons/testFail.png';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';

const ContainerPG = styled.div`
  overflow-y: hidden;
  width: 100%;
  display: grid;
  grid-template-rows: 60px 99%;
  grid-template-columns: 66% 34%;
  grid-template-areas:
    ' header header'
    ' codeView info';
`;

const ItemInfo = styled.div`
  grid-area: info;
`;

const ItemTitle = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  align-items: center;
  justify-content: center;
  //@formatter:off
  background: linear-gradient(
    90deg,
    rgba(95, 100, 255, 0.7) 0%,
    rgba(174, 78, 255, 0.85) 100%
  );
  //@formatter:on
  font-size: 34px;
  color: white;
`;

const ItemTitle2 = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  align-items: center;
  justify-content: center;
  font-size: 21px;
  border-bottom: 2px solid #a779ff;
`;

const ItemParagraph = styled.div`
  height: 100px;
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: justify;
  font-size: 15px;
  margin-bottom: 25px;
  line-height: 25px;
`;

const datos = {
  title: 'Reto # 1',
  // eslint-disable-next-line prettier/prettier
  instructions:
    'El ejercicio clasico e introductorio. Tan solo una suma de dos valores este tradicional primer programa para acercarse al ambiente en un lenjuague de programación.',
  objectives:
    'Crea una función que retorne la suma de dos variables.  Asegurate de que sea exitoso. Si tu solución es correcta estaràs listo para pasar al siguiente ejercicio y adentrarte en el maravilloso mundo de JavaScript.',
  debug:
    'When a test fails, a message is displayed describing what went wrong and for which input. You can also use the fact that any console output will be shown too. You can write to the console using:  "Console.log("Debug Message")"',
  solved:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry"s standard dummy text ever since the 1500s, .',
  error: {
    errorMsj: 'Test Suite Failed to Run',
    errorCode: 'Syntax Error'
  }
};

const ItemCodeView = styled.div`
  height: 39%;
  box-shadow: 3px 3px 3px #a779ff;
  grid-area: codeView;

  & section {
    margin: 0;
  }
`;

const ItemButton = styled.div`
  display: flex;
  width: 100%;
  padding: 3.5rem 0 1rem 0;
  justify-content: center;
  align-items: center;
`;

const ItemButtonRun = styled.div`
  height: 35px;
  width: 131px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #a779ff;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #a779ff;
  font-size: 14px;
  font-weight: bold;
  padding-top: 3px;

  &:hover {
    color: white;
    background-color: #a779ff;
    border: 0.5px solid rgba(85, 91, 255, 0.79);
    cursor: pointer;
  }
`;

const ItemButtonSubmit = styled.div`
  height: 35px;
  width: 82px;
  font-size: 14px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
  font-weight: bold;
  background-color: #a779ff;
  border-radius: 6px;
  border: 1px solid #a779ff;
  padding-top: 3px;
  margin: 0 30px;

  &:hover {
    color: #a779ff;
    background-color: white;
    border: 0.5px solid rgba(85, 91, 255, 0.79);
    cursor: pointer;
  }
`;
const Loading = styled.div`
  height: 89%;
  width: 34%;
  padding: 0 1rem;
  position: absolute;
  top: 60px;
  z-index: 1;
  grid-area: info;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 2rem;
  color: black;
`;

const LoadingImg = styled.div`
  width: 70px;
  height: 70px;
  border: 10px solid #eee;
  border-top: 10px solid #a779ff;
  border-radius: 50%;
  animation-name: girar;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  z-index: 2;
  @keyframes girar {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const SuccessContainer = styled.div`
  height: 85%;
  width: 95%;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 2rem;
  color: black;
  border: 2px solid #a779ff;
`;
const SuccessDialogue = styled.div`
  height: 50%;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;
const SuccessParagraph = styled.p`
  font-size: 1.5rem;
  text-align: justify;
`;
const SuccessTest = styled.p`
  padding: 1rem 3rem;
  font-size: 2rem;
  border: 2px solid #0ac433;
  display: flex;
  gap: 1rem;
`;
const FailContainer = styled(SuccessContainer)`
  border: 2px solid #f04925;
`;

const FailTest = styled(SuccessTest)`
  border: 2px solid #f04925;
`;

const FailParagraph = styled(SuccessParagraph)``;

const PlayGround = () => {
  const [state, setState] = React.useState({
    value: '',
    error: false,
    loading: false,
    deleted: false,
    confirmed: false,
    success: '',
    message: '',
    mounted: false
  });

  const {
    query: { id }
  } = useRouter();

  const editorRef = useRef(null);
  const user = useUser();
  React.useEffect(() => {
    if (state.mounted) {
      fetch(`http://54.210.111.183/api/v1/runner/on/node/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          user: user.user.sub
        }
      })
        .then((data) => data.json())
        .then((data) => {
          editorRef.current.getModel().setValue(data.data.func_template);
        });
    }
  }, [state.mounted]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    setState({ ...state, mounted: true });
  }

  const onTest = () => {
    fetch(`http://54.210.111.183/api/v1/runner/check/node/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        user: user.user.sub
      },
      body: JSON.stringify({
        code: editorRef.current.getValue()
      })
    })
      .then((r) => r.json())
      .then((data) => onSuccess(data))
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = () => {
    fetch(`http://54.210.111.183/api/v1/runner/submit/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        user: user.user.sub
      },
      body: JSON.stringify({
        challengeId: id,
        engine: 'node' //Hardcoded
      })
    });
  };

  const onSuccess = async (data) => {
    setState({
      ...state,
      success: data.test_result.status,
      message: data.test_result.status
    });
  };

  const onWrite = (newValue) => {
    setState({
      ...state,
      value: newValue
    });
  };

  const onCheck = () => {
    setState({
      ...state,
      loading: true
    });
  };

  const onError = () => {
    setState({
      ...state,
      error: true,
      loading: false,
      confirmed: false
    });
  };

  const onReset = () => {
    setState({
      ...state,
      confirmed: false,
      error: false,
      success: ''
    });
  };

  const onConfirmed = () => {
    setState({
      ...state,
      error: false,
      loading: false,
      confirmed: true
    });
  };

  React.useEffect(() => {
    if (!state.loading) {
      if (state.success === 'passed') {
        onConfirmed();
      } else if (state.success === 'failed') {
        onError();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);
  if (!state.confirmed && !state.error) {
    return (
      <ContainerPG>
        <Header />
        <Editor
          height="90vh"
          width="100%"
          defaultLanguage="javascript"
          defaultValue={state.value}
          theme="vs-dark"
          onMount={handleEditorDidMount}
        />
        <ItemInfo>
          <ItemTitle>{datos.title}</ItemTitle>
          <ItemTitle2>Instrucciones</ItemTitle2>
          <ItemParagraph>{datos.instructions}</ItemParagraph>
          <ItemTitle2>Objetivos</ItemTitle2>
          <ItemParagraph>{datos.objectives}</ItemParagraph>
          <ItemCodeView>
            {state.loading && (
              <Loading>
                <LoadingImg />
                Ejecutando los test ...
              </Loading>
            )}
            <ItemButton>
              <ItemButtonRun
                onClick={() => {
                  onCheck();
                  onTest();
                }}
              >
                Run Tests
                <Image id="img-icon" src={Coolicon} alt="Run Challenge" />
              </ItemButtonRun>
              <ItemButtonSubmit
                onClick={() => {
                  !state.confirmed
                    ? alert('Completa el desafio primero')
                    : undefined;
                }}
              >
                Submit
              </ItemButtonSubmit>
            </ItemButton>
          </ItemCodeView>
        </ItemInfo>
      </ContainerPG>
    );
  } else if (state.confirmed) {
    return (
      <ContainerPG>
        <Header />
        <Editor
          height="90vh"
          width="100%"
          defaultLanguage="javascript"
          defaultValue={state.value}
          theme="vs-dark"
          onMount={handleEditorDidMount}
        />
        <ItemInfo>
          <SuccessContainer>
            <SuccessTest>
              <Image id="img-icon" src={iconSuccess} alt="Loading Icon"></Image>
              5 Test pasados
            </SuccessTest>
            <SuccessDialogue>
              Felicidades pasaste el desafio
              <SuccessParagraph>
                Sigue adelante y no te rindas. aun queda mucho para llegar a la
                cima, haz click sobre el boton submit para guardar tu progreso y
                regresar a la seccion de categorias.
              </SuccessParagraph>
            </SuccessDialogue>
          </SuccessContainer>
          <ItemCodeView>
            <ItemButton>
              <ItemButtonRun
                onClick={() => {
                  onReset();
                }}
              >
                Regresar
              </ItemButtonRun>
              <Link href="/challenges/categories" passHref>
                <ItemButtonSubmit
                  onClick={() => {
                    !state.confirmed
                      ? alert('Completa el desafio primero')
                      : onSubmit();
                  }}
                >
                  Submit
                </ItemButtonSubmit>
              </Link>
            </ItemButton>
          </ItemCodeView>
        </ItemInfo>
      </ContainerPG>
    );
  } else if (state.error) {
    return (
      <ContainerPG>
        <Header />
        <Editor
          height="90vh"
          width="100%"
          defaultLanguage="javascript"
          defaultValue={state.value}
          theme="vs-dark"
          onMount={handleEditorDidMount}
        />
        <ItemInfo>
          <FailContainer>
            <FailTest>
              <Image id="img-icon" src={iconFail} alt="Loading Icon" />0 Test
              pasados
            </FailTest>
            <SuccessDialogue>
              Encontramos unos errores en tu codigo
              <FailParagraph>{state.message}</FailParagraph>
              <FailParagraph>
                No te rindas, de los errores se aprende.
              </FailParagraph>
            </SuccessDialogue>
          </FailContainer>
          <ItemCodeView>
            <ItemButton>
              <ItemButtonRun
                onClick={() => {
                  onReset();
                }}
              >
                Regresar
              </ItemButtonRun>
            </ItemButton>
          </ItemCodeView>
        </ItemInfo>
      </ContainerPG>
    );
  }
};

export default PlayGround;
