import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";

export default function (
	id: string,
	canSort?: () => boolean,
	data?: any
) {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
		isOver,
		over,
		active,
	} = useSortable({
		id,
		disabled: canSort ? !canSort() : false,
		data,
	});

	// 计算样式，应用拖拽变换
	const style: CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	// 根据被拖拽元素与目标项中心点的相对位置判断插入边缘：
	// 拖到目标项上半部分时显示上边缘（插入到目标之前），下半部分时显示下边缘（插入到目标之后），
	// 使视觉指示与 arrayMove 的实际结果保持一致。
	let closestEdge: "top" | "bottom" | null = null;
	const activeRect = active?.rect.current.translated;
	if (isOver && over && activeRect) {
		const activeCenter = activeRect.top + activeRect.height / 2;
		const overCenter = over.rect.top + over.rect.height / 2;
		closestEdge = activeCenter < overCenter ? "top" : "bottom";
	}

	return {
		closestEdge,
		dragging: isDragging,
		draggedOver: isOver,
		setElRef: setNodeRef,
		setDragHandleRef: setActivatorNodeRef,
		attributes,
		listeners,
		style,
	};
}
