"""Logging configuration"""
import logging
import sys
from datetime import datetime


def setup_logging():
    """Configure structured logging"""
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    
    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    root_logger.addHandler(console_handler)
    
    # App logger
    app_logger = logging.getLogger("app")
    app_logger.setLevel(logging.INFO)
    
    return app_logger


# Initialize logger
logger = setup_logging()
