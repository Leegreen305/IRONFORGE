from setuptools import setup, find_packages

setup(
    name="ironforge",
    version="1.0.0",
    description="AI-powered Military Decision Making Process (MDMP) engine",
    author="IRONFORGE Contributors",
    license="MIT",
    packages=find_packages(exclude=["tests", "webapp", "docs", "scenarios"]),
    python_requires=">=3.10",
    install_requires=[
        "fastapi>=0.110.0",
        "uvicorn[standard]>=0.29.0",
        "pydantic>=2.6.0",
        "pytest>=8.1.0",
        "httpx>=0.27.0",
        "anthropic>=0.25.0",
        "reportlab>=4.1.0",
        "python-multipart>=0.0.9",
        "jinja2>=3.1.0",
    ],
    entry_points={
        "console_scripts": [
            "ironforge=start:main",
        ],
    },
)
