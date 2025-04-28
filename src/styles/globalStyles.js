import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Playfair Display', serif;
    background: linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%);
    color: #2C2C2C;
    line-height: 1.6;
  }

  .luxury-container {
    position: relative;
    padding: 2rem;
    background: linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%);
    border: 1px solid #D4AF37;
    border-radius: 16px;
    box-shadow: 0 4px 8px rgba(212, 175, 55, 0.15);

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D4AF37'%3E%3Cpath d='M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z'/%3E%3C/svg%3E");
      background-size: contain;
      opacity: 0.5;
    }

    &::before {
      top: 10px;
      left: 10px;
    }

    &::after {
      bottom: 10px;
      right: 10px;
    }
  }

  .luxury-title {
    position: relative;
    display: inline-block;
    padding: 0 1rem;
    margin-bottom: 2rem;
    font-size: 2.5rem;
    font-weight: 700;
    color: #D4AF37;
    text-align: center;

    &::before,
    &::after {
      content: '✦';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.5rem;
      color: #D4AF37;
      opacity: 0.8;
    }

    &::before {
      left: -1rem;
    }

    &::after {
      right: -1rem;
    }
  }

  .luxury-button {
    position: relative;
    padding: 12px 24px;
    background: linear-gradient(45deg, #D4AF37 30%, #B38B2D 90%);
    border: none;
    border-radius: 8px;
    color: #000000;
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        120deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      transition: 0.5s;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);

      &::before {
        left: 100%;
      }
    }
  }

  .luxury-card {
    position: relative;
    padding: 2rem;
    background: linear-gradient(135deg, #FFFFFF 0%, #FDF6E3 100%);
    border: 1px solid #D4AF37;
    border-radius: 16px;
    box-shadow: 0 4px 8px rgba(212, 175, 55, 0.15);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(212, 175, 55, 0.25);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #D4AF37, #B38B2D);
    }
  }

  .luxury-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #D4AF37;
    border-radius: 8px;
    background: transparent;
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    color: #2C2C2C;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #B38B2D;
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
    }
  }

  .luxury-select {
    position: relative;
    width: 100%;
    padding: 12px;
    border: 2px solid #D4AF37;
    border-radius: 8px;
    background: transparent;
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    color: #2C2C2C;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D4AF37'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 20px;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #B38B2D;
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
    }
  }

  .luxury-divider {
    position: relative;
    height: 2px;
    background: linear-gradient(90deg, transparent, #D4AF37, transparent);
    margin: 2rem 0;

    &::before,
    &::after {
      content: '✦';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.5rem;
      color: #D4AF37;
      opacity: 0.8;
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }
  }
`; 