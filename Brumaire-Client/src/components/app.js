import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { ChainId } from '@sushiswap/sdk';
import { auth } from '../utils/authService';

import ModalActions from 'actions/modal.actions';

import ProtectedRoute from './ProtectedRoute';
import AccountModal from './AccountModal';
import WFTMModal from './WFTMModal';
import PaintBoard from './PaintBoard';
import LandingPage from '../pages/landingpage';
import SignIn from '../pages/Auth';
import ExplorePage from '../pages/explorepage';
import AccountDetails from '../pages/AccountDetails';
import NFTItem from '../pages/NFTItem';
import CollectionCreate from '../pages/Collection/Create';
import CollectionReview from '../pages/Collection/Review';
import PriceActions from 'actions/price.actions';

// const App = () => {
//   const dispatch = useDispatch();
//   const { chainId } = useWeb3React();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const { active, activate } = useWeb3React();
//   const [priceInterval, setPriceInterval] = useState(null);

//   const getPrice = async () => {
//     try {
//       if (chainId === ChainId.FANTOM) {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const oracle = new ethers.Contract(
//           '0xf4766552D15AE4d256Ad41B6cf2933482B0680dc',
//           [
//             {
//               inputs: [],
//               name: 'latestAnswer',
//               outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
//               stateMutability: 'view',
//               type: 'function',
//             },
//           ],
//           provider
//         );
//         const _price = await oracle.latestAnswer();
//         const price = parseFloat(_price.toString()) / 10 ** 8;
//         dispatch(PriceActions.updatePrice(price));
//       } else if (chainId === ChainId.FANTOM_TESTNET) {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const oracle = new ethers.Contract(
//           '0xe04676B9A9A2973BCb0D1478b5E1E9098BBB7f3D',
//           [
//             {
//               inputs: [],
//               name: 'latestAnswer',
//               outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
//               stateMutability: 'view',
//               type: 'function',
//             },
//           ],
//           provider
//         );
//         const _price = await oracle.latestAnswer();
//         const price = parseFloat(_price.toString()) / 10 ** 8;
//         dispatch(PriceActions.updatePrice(price));
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     if (priceInterval) {
//       clearInterval(priceInterval);
//     }

//     getPrice();
//     setPriceInterval(setInterval(getPrice, 1000 * 10));
//   }, [chainId]);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => {
//       if (user) {
//         setIsAuthenticated(true);
//         console.log('User is authenticated, setting state to true');
//       } else {
//         setIsAuthenticated(false);
//         console.log('User is not authenticated, setting state to false');
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Track changes to `isAuthenticated` and `active`
//   useEffect(() => {
//     console.log('Authentication State Changed:', isAuthenticated);
//     console.log('Wallet Connection State Changed:', active);
//   }, [isAuthenticated, active]);

//   const handleWalletConnection = async () => {
//     try {
//       if (!active) {
//         await activate(); // Trigger wallet connection here
//         console.log('Wallet connected successfully.');
//       }
//     } catch (error) {
//       console.error('Error connecting wallet:', error);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated) {
//       console.log('User is authenticated, attempting to connect wallet...');
//       handleWalletConnection();
//     }
//   }, [isAuthenticated]);

//   return (
//     <div>
//       <Router>
//         <Switch>
//           {/* Unprotected Route */}
//           <Route path="/signin" component={SignIn} />

//           {/* Protected Routes */}
//           <ProtectedRoute
//             exact
//             path="/"
//             component={LandingPage}
//             isAuthenticated={isAuthenticated}
//             active={active}
//           />
//           <ProtectedRoute
//             path="/explore"
//             component={ExplorePage}
//             isAuthenticated={isAuthenticated}
//             active={active}
//           />
//           <ProtectedRoute
//             path="/collection/register"
//             component={() => <CollectionCreate isRegister />}
//             isAuthenticated={isAuthenticated}
//             active={active}
//           />
//           <ProtectedRoute
//             path="/collection/review"
//             component={CollectionReview}
//             isAuthenticated={isAuthenticated}
//             active={active}
//           />
//           <ProtectedRoute
//             exact
//             path="/create"
//             component={PaintBoard}
//             isAuthenticated={isAuthenticated}
//             active={active}
//           />
//           <ProtectedRoute
//             path="/account/:uid"
//             component={AccountDetails}
//             isAuthenticated={isAuthenticated}
//             active={active}
//           />

//           {/* Open Routes */}
//           <Route path="/explore/:addr/:id" component={NFTItem} />

//           {/* Catch-All Redirect to SignIn */}
//           <Route path="*">
//             <Redirect to="/signin" />
//           </Route>
//         </Switch>
//         <AccountModal />
//         <WFTMModal />
//         <Toaster position="bottom-right" reverseOrder={false} />
//       </Router>
//     </div>
//   );
// };

const App = () => {
  const dispatch = useDispatch();
  const { chainId, active } = useWeb3React();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [priceInterval, setPriceInterval] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPrice = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let oracleAddress;

      if (chainId === ChainId.FANTOM) {
        oracleAddress = '0xf4766552D15AE4d256Ad41B6cf2933482B0680dc';
      } else if (chainId === ChainId.FANTOM_TESTNET) {
        oracleAddress = '0xe04676B9A9A2973BCb0D1478b5E1E9098BBB7f3D';
      }

      if (oracleAddress) {
        const oracle = new ethers.Contract(
          oracleAddress,
          [
            {
              inputs: [],
              name: 'latestAnswer',
              outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
              stateMutability: 'view',
              type: 'function',
            },
          ],
          provider
        );
        const _price = await oracle.latestAnswer();
        const price = parseFloat(_price.toString()) / 10 ** 8;
        dispatch(PriceActions.updatePrice(price));
      }
    } catch (err) {
      console.log('Error fetching price:', err);
    }
  };

  useEffect(() => {
    if (priceInterval) {
      clearInterval(priceInterval);
    }

    getPrice();
    setPriceInterval(setInterval(getPrice, 1000 * 10));
  }, [chainId]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('User is authenticated, setting state to true');
        setIsAuthenticated(true);
      } else {
        console.log('User is not authenticated, setting state to false');
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Updated Effect to Trigger Wallet Connection Modal
  useEffect(() => {
    if (isAuthenticated && !active) {
      console.log(
        'User is authenticated, attempting to connect wallet...',
        isAuthenticated,
        active
      );
      dispatch(ModalActions.showConnectWalletModal()); // Show Wallet Connection Modal
    }
  }, [isAuthenticated, active, dispatch]);

  // // Example Sign-Out function (Add in your Sign-Out component)
  // const handleSignOut = async () => {
  //   try {
  //     await auth.signOut();
  //     console.log('User signed out successfully.');
  //   } catch (error) {
  //     console.error('Error signing out:', error);
  //   }
  // };

  return loading ? ( // <-- Show a loading indicator while waiting for auth and wallet states
    <div>Loading...</div>
  ) : (
    <div>
      <Router>
        <Switch>
          <Route path="/signin" component={SignIn} />

          <ProtectedRoute
            exact
            path="/"
            component={LandingPage}
            isAuthenticated={isAuthenticated}
            active={active}
          />
          <ProtectedRoute
            path="/explore"
            component={ExplorePage}
            isAuthenticated={isAuthenticated}
            active={active}
          />
          <ProtectedRoute
            path="/collection/register"
            component={() => <CollectionCreate isRegister />}
            isAuthenticated={isAuthenticated}
            active={active}
          />
          <ProtectedRoute
            path="/collection/review"
            component={CollectionReview}
            isAuthenticated={isAuthenticated}
            active={active}
          />
          <ProtectedRoute
            exact
            path="/create"
            component={PaintBoard}
            isAuthenticated={isAuthenticated}
            active={active}
          />
          <ProtectedRoute
            path="/account/:uid"
            component={AccountDetails}
            isAuthenticated={isAuthenticated}
            active={active}
          />

          {/* Open Routes */}
          <Route path="/explore/:addr/:id" component={NFTItem} />

          {/* Catch-All Redirect to SignIn */}
          <Route path="*">
            <Redirect to="/signin" />
          </Route>
        </Switch>
        <AccountModal />
        <WFTMModal />
        <Toaster position="bottom-right" reverseOrder={false} />
      </Router>
    </div>
  );
};

export default App;
