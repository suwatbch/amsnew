
IMAGE_NAME="amsdeploy"
CONTAINER_NAME="ams-deploy-serve"
HOST_PORT=8001
CONTAINER_PORT=3000
WATCH_DIR="$(pwd)" 

# ฟังก์ชันสำหรับ build และ run container
build_and_run() {
    echo "กำลังสร้าง Docker image..."
    docker build -t $IMAGE_NAME $WATCH_DIR

    if [ $? -ne 0 ]; then
        echo "เกิดข้อผิดพลาดในการสร้าง image"
        return 1
    fi

    echo "กำลังหยุดและลบ container เก่า"
    docker stop $CONTAINER_NAME 2>/dev/null
    docker rm $CONTAINER_NAME 2>/dev/null

    echo "กำลังรัน container ใหม่"
    docker run --name $CONTAINER_NAME \
               -p $HOST_PORT:$CONTAINER_PORT \
               -v $WATCH_DIR:/app \
               -d $IMAGE_NAME

    if [ $? -ne 0 ]; then
        echo "เกิดข้อผิดพลาดในการรัน container"
        return 1
    fi

    echo "Container พร้อมใช้งานแล้ว"
}

# สร้างและรัน container ครั้งแรก
build_and_run

# ตรวจสอบการเปลี่ยนแปลงและ rebuild อัตโนมัติ
echo "กำลังตรวจสอบการเปลี่ยนแปลงใน $WATCH_DIR..."
inotifywait -m -r -e modify,create,delete,move --format '%w%f' $WATCH_DIR |
while read file
do
    echo "ตรวจพบการเปลี่ยนแปลงใน $file"
    build_and_run
done