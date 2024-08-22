#include <opencv2/opencv.hpp>

int main(int argc, char** argv){
  if (argc < 2){
    std::cerr << "Usage: " << argv[0] << " <device>" << std::endl;
    return 1;
  }
  std::string dev = argv[1];
  auto video_capture = cv::VideoCapture(dev);
  // video_capture.set(cv::CAP_PROP_FRAME_WIDTH, 640);
  // video_capture.set(cv::CAP_PROP_FRAME_HEIGHT, 480);

  if (!video_capture.isOpened()){
    std::cerr << "Error: Could not open camera." << std::endl;
    return 1;
  }

  cv::Mat frame;
  while (true){
    video_capture >> frame;
    if (frame.empty()){
      std::cerr << "Error: Could not read frame." << std::endl;
      break;
    }
    cv::imshow("Camera", frame);
    if (cv::waitKey(1) == 27){
      break;
    }
  }
}